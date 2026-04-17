/**
 * Flyto2 Dynamic Pricing Configuration
 * Reads pricing settings from Firestore and renders dynamically.
 * Supports Stripe Checkout for subscription purchases.
 */

// Cloud API base URL (subscription checkout endpoint)
const CLOUD_API_URL = 'https://flyto-cloud-api-673906368352.asia-east1.run.app';

/**
 * Fallback pricing — used when Firebase/Cloud Function is unreachable.
 * Keep in sync with backend plan_config.py
 */
const FALLBACK_PRICING = {
	_lastUpdated: '2026-04-17',
	version: 2,
	billing_cycle: 'monthly', // default view
	sections: [
		{
			key: "cloud_saas",
			title: "Cloud Plans",
			enabled: true,
			comingSoon: false,
			plans: [
				{
					id: "free",
					name: "Free",
					price: 0,
					price_yearly: 0,
					currency: "USD",
					billing: "monthly",
					features: [
						"1,000 monthly points",
						"5 workflows",
						"5 collaboration hours/month",
						"Community support",
						"7-day Pro trial included",
					],
					enabled: true,
					popular: false,
					cta: { type: "signup", label: "Get Started Free" },
				},
				{
					id: "pro",
					name: "Pro",
					price: 9,
					price_yearly: 86.40,
					currency: "USD",
					billing: "monthly",
					features: [
						"50,000 monthly points",
						"Unlimited workflows",
						"Unlimited collaboration hours",
						"All pro modules",
						"Cloud execution",
						"Priority support",
					],
					enabled: true,
					popular: true,
					cta: { type: "checkout", label: "Subscribe" },
				},
				{
					id: "team",
					name: "Team",
					price: 19,
					price_yearly: 182.40,
					currency: "USD",
					billing: "monthly",
					features: [
						"200,000 monthly points",
						"Unlimited workflows",
						"Unlimited collaboration hours",
						"All pro modules",
						"Team management & RBAC",
						"Shared template library",
						"Priority support",
					],
					enabled: true,
					popular: false,
					cta: { type: "checkout", label: "Subscribe" },
				},
			],
		},
		{
			key: "enterprise",
			title: "Enterprise",
			enabled: true,
			comingSoon: false,
			plans: [
				{
					id: "enterprise",
					name: "Enterprise",
					price: null,
					currency: "USD",
					pricing_type: "contact",
					features: [
						"Unlimited everything",
						"Dedicated support & SLA",
						"On-premise deployment",
						"RBAC & audit logging",
						"Custom integrations",
						"SSO / SCIM provisioning",
					],
					enabled: true,
					popular: false,
					cta: { type: "contact", label: "Contact Sales", url: "contact.html" },
				},
			],
		},
	],
};

// Current billing cycle (toggled by user)
let _currentBillingCycle = 'monthly';

// UI Timing Constants
const UI_TIMING = {
	BUTTON_RESET_SHORT: 2000,
	BUTTON_RESET_LONG: 3000,
};

/**
 * HTML escape to prevent XSS
 */
function escapeHtml(text) {
	if (text === null || text === undefined) return '';
	const div = document.createElement('div');
	div.textContent = String(text);
	return div.innerHTML;
}

/**
 * Convert API pricing response to config format.
 * Handles both section-based (Firestore pricing_v1) and flat plans array (/billing/plans).
 */
function convertApiPricingToConfig(apiPricing) {
	if (apiPricing.sections) return apiPricing;

	// Convert /billing/plans flat array → sections format
	if (Array.isArray(apiPricing)) {
		const cloudPlans = [];
		const enterprisePlans = [];

		apiPricing.forEach(p => {
			const plan = {
				id: p.id,
				name: p.name || (p.id ? p.id.charAt(0).toUpperCase() + p.id.slice(1) : ''),
				price: p.price_monthly_cents ? p.price_monthly_cents / 100 : 0,
				price_yearly: p.price_yearly_cents ? p.price_yearly_cents / 100 : 0,
				currency: 'USD',
				billing: 'monthly',
				features: p.features || [],
				enabled: true,
				popular: p.id === 'pro',
			};

			if (p.is_custom_pricing || p.id === 'enterprise') {
				plan.price = null;
				plan.pricing_type = 'contact';
				plan.cta = { type: 'contact', label: 'Contact Sales', url: 'contact.html' };
				enterprisePlans.push(plan);
			} else if (p.id === 'free' || plan.price === 0) {
				plan.cta = { type: 'signup', label: 'Get Started Free' };
				cloudPlans.push(plan);
			} else {
				plan.cta = { type: 'checkout', label: 'Subscribe' };
				cloudPlans.push(plan);
			}
		});

		return {
			version: 2,
			billing_cycle: 'monthly',
			sections: [
				{ key: 'cloud_saas', title: 'Cloud Plans', enabled: cloudPlans.length > 0, comingSoon: false, plans: cloudPlans },
				{ key: 'enterprise', title: 'Enterprise', enabled: enterprisePlans.length > 0, comingSoon: false, plans: enterprisePlans },
			],
		};
	}

	return FALLBACK_PRICING;
}

/**
 * Fetch pricing config.
 *
 * Priority order:
 *   1. Cloud API /billing/plans (public, reads from admin-managed plan_config)
 *   2. Cloud Function getPricing (legacy)
 *   3. Firestore settings/pricing_v1 (legacy)
 *   4. Hardcoded FALLBACK_PRICING
 */
async function fetchPricingConfig() {
	try {
		// 1. Cloud API — single source of truth (synced with admin/pricing)
		try {
			const response = await fetch(`${CLOUD_API_URL}/billing/plans`);
			if (response.ok) {
				const data = await response.json();
				if (data.ok && Array.isArray(data.plans) && data.plans.length > 0) {
					return convertApiPricingToConfig(data.plans);
				}
			}
		} catch (apiError) {
			console.warn('Cloud API /billing/plans failed, falling back:', apiError);
		}

		// 2. Legacy: Cloud Function
		if (typeof window.FlytoAuth !== 'undefined' && window.FlytoAuth.FIREBASE_URL) {
			try {
				const response = await fetch(`${window.FlytoAuth.FIREBASE_URL}/getPricing`);
				const data = await response.json();
				if (data.ok && data.pricing) {
					return convertApiPricingToConfig(data.pricing);
				}
			} catch (apiError) {
				console.warn('Cloud Function API failed, falling back:', apiError);
			}
		}

		// 3. Legacy: Firestore direct read
		if (typeof firebase !== 'undefined' && firebase.firestore) {
			const db = firebase.firestore();
			const v1Doc = await db.collection('settings').doc('pricing_v1').get();
			if (v1Doc.exists) {
				const data = v1Doc.data();
				if (data.sections && data.sections.some(s => s.enabled && s.plans && s.plans.length > 0)) {
					return data;
				}
			}
		}

		return FALLBACK_PRICING;
	} catch (error) {
		return FALLBACK_PRICING;
	}
}

/**
 * Get display price based on current billing cycle
 */
function getDisplayPrice(plan) {
	if (plan.price === null || plan.price === undefined) return null;
	if (_currentBillingCycle === 'yearly' && plan.price_yearly) {
		return { amount: (plan.price_yearly / 12).toFixed(2), symbol: '$', period: '/mo', billed: 'billed yearly' };
	}
	return { amount: plan.price, symbol: '$', period: '/mo', billed: '' };
}

/**
 * Handle subscription checkout via Cloud API
 */
async function handleCheckout(planId, billingCycle) {
	// Must be logged in
	if (typeof window.FlytoAuth === 'undefined' || !window.FlytoAuth.isLoggedIn()) {
		window.FlytoAuth.showAuthModal();
		// Wait for auth, then retry
		window.addEventListener('authStateChanged', function handler(e) {
			if (e.detail.user) {
				window.removeEventListener('authStateChanged', handler);
				handleCheckout(planId, billingCycle);
			}
		});
		return;
	}

	// Get button and show loading
	const btn = document.querySelector(`[data-plan-id="${planId}"]`);
	if (btn) {
		btn.disabled = true;
		btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Redirecting...';
	}

	try {
		const token = await window.FlytoAuth.getIdToken();
		const response = await fetch(`${CLOUD_API_URL}/subscriptions/subscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({
				plan_id: planId,
				billing_cycle: billingCycle || _currentBillingCycle,
				success_url: window.location.origin + '/pricing.html?success=true',
				cancel_url: window.location.origin + '/pricing.html?cancelled=true',
			}),
		});

		const data = await response.json();

		if (data.ok && data.session_url) {
			window.location.href = data.session_url;
			return;
		}

		// Handle errors
		const errorMsg = data.detail || data.error || 'Failed to create checkout session';
		alert(errorMsg);
	} catch (error) {
		console.error('Checkout error:', error);
		alert('Unable to connect to payment service. Please try again.');
	}

	// Reset button
	if (btn) {
		btn.disabled = false;
		btn.innerHTML = 'Subscribe';
	}
}

/**
 * Handle free plan signup
 */
function handleFreeSignup() {
	if (typeof window.FlytoAuth !== 'undefined' && window.FlytoAuth.isLoggedIn()) {
		window.location.href = 'https://cloud.flyto2.com';
	} else {
		window.FlytoAuth.showAuthModal();
		window.addEventListener('authStateChanged', function handler(e) {
			if (e.detail.user) {
				window.removeEventListener('authStateChanged', handler);
				window.location.href = 'https://cloud.flyto2.com';
			}
		});
	}
}

/**
 * Render a single plan card
 */
function renderPlanCard(plan) {
	const isPopular = plan.popular;
	const isContact = plan.price === null || plan.pricing_type === 'contact';
	const priceInfo = getDisplayPrice(plan);
	const escapedName = escapeHtml(plan.name || '');

	// Price display
	let priceHtml = '';
	if (isContact) {
		priceHtml = '<span style="font-size: 32px; font-weight: 700;">Custom</span>';
	} else if (priceInfo.amount == 0) {
		priceHtml = '<span class="price-currency">$</span>0';
	} else {
		priceHtml = `<span class="price-currency">${priceInfo.symbol}</span>${priceInfo.amount}`;
	}

	let periodHtml = '';
	if (isContact) {
		periodHtml = 'Contact us for pricing';
	} else if (priceInfo && priceInfo.amount > 0) {
		periodHtml = priceInfo.period;
		if (priceInfo.billed) {
			periodHtml += ` <span style="font-size:12px;opacity:0.7">(${priceInfo.billed})</span>`;
		}
	} else {
		periodHtml = 'free forever';
	}

	// Features
	const featuresHtml = (plan.features || []).map(f => `
		<li class="pricing-feature-item">
			<i class="bi bi-check-circle-fill feature-icon"></i>
			<span>${escapeHtml(f)}</span>
		</li>
	`).join('');

	// CTA button
	let ctaHtml = '';
	const cta = plan.cta || {};
	if (cta.type === 'checkout') {
		ctaHtml = `<button class="btn-pricing" data-plan-id="${escapeHtml(plan.id)}" onclick="handleCheckout('${escapeHtml(plan.id)}', '${_currentBillingCycle}')">${escapeHtml(cta.label || 'Subscribe')}</button>`;
	} else if (cta.type === 'signup') {
		ctaHtml = `<button class="btn-pricing ${isPopular ? '' : 'btn-pricing-outline'}" onclick="handleFreeSignup()">${escapeHtml(cta.label || 'Get Started')}</button>`;
	} else if (cta.type === 'contact') {
		ctaHtml = `<a href="${escapeHtml(cta.url || 'contact.html')}" class="btn-pricing btn-pricing-outline">${escapeHtml(cta.label || 'Contact Sales')}</a>`;
	}

	return `
		<div class="col-lg-3 col-md-6 mb-40">
			<div class="pricing-card-3d ${isPopular ? 'pricing-card-popular' : ''} wow fadeInUp">
				${isPopular ? '<div class="popular-badge"><i class="bi bi-star-fill"></i> Most Popular</div>' : ''}
				<div style="font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px;${isPopular ? 'color:#c4b5fd' : 'color:#7c3aed'}">${escapedName}</div>
				<div class="price-animated">
					${priceHtml}
				</div>
				<div class="price-period">${periodHtml}</div>
				<ul class="pricing-feature-list">
					${featuresHtml}
				</ul>
				${ctaHtml}
			</div>
		</div>
	`;
}

/**
 * Render billing cycle toggle
 */
function renderBillingToggle() {
	return `
		<div class="pricing-tabs-wrapper">
			<div class="pricing-tab-buttons">
				<button class="pricing-tab ${_currentBillingCycle === 'monthly' ? 'active' : ''}" data-billing="monthly">
					<i class="bi bi-calendar3"></i> Monthly
				</button>
				<button class="pricing-tab ${_currentBillingCycle === 'yearly' ? 'active' : ''}" data-billing="yearly">
					<i class="bi bi-calendar-check"></i> Yearly <span class="save-badge">Save 20%</span>
				</button>
			</div>
		</div>
	`;
}

/**
 * Render all pricing sections
 */
function renderPricingTabs(config) {
	const container = document.getElementById('pricingContainer');
	if (!container) return;

	const sections = (config.sections || []).filter(s => s.enabled);

	let html = renderBillingToggle();
	html += '<div class="row justify-content-center">';

	sections.forEach(section => {
		if (section.comingSoon) {
			html += renderComingSoonCard(section);
		} else {
			(section.plans || []).filter(p => p.enabled !== false).forEach(plan => {
				html += renderPlanCard(plan);
			});
		}
	});

	html += '</div>';

	// Success/cancel message
	const params = new URLSearchParams(window.location.search);
	if (params.get('success') === 'true') {
		html = `<div class="alert" style="background:#10b981;color:#fff;padding:20px;border-radius:12px;text-align:center;margin-bottom:30px;font-weight:600">
			<i class="bi bi-check-circle-fill" style="font-size:24px;margin-right:8px"></i>
			Subscription activated! Welcome to Pro. <a href="https://cloud.flyto2.com" style="color:#fff;text-decoration:underline">Go to Dashboard →</a>
		</div>` + html;
	} else if (params.get('cancelled') === 'true') {
		html = `<div class="alert" style="background:#f59e0b;color:#fff;padding:16px;border-radius:12px;text-align:center;margin-bottom:30px">
			Checkout cancelled. You can try again anytime.
		</div>` + html;
	}

	container.innerHTML = html;
}

/**
 * Render Coming Soon card
 */
function renderComingSoonCard(section) {
	return `
		<div class="col-lg-6 col-md-8 mx-auto mb-4">
			<div class="pricing-card-3d coming-soon-card wow fadeInUp">
				<div class="coming-soon-badge">${escapeHtml(section.badge || 'Coming Soon')}</div>
				<h3 class="coming-soon-title">${escapeHtml(section.title)}</h3>
				<p class="coming-soon-desc">${escapeHtml(section.description || '')}</p>
			</div>
		</div>
	`;
}

/**
 * Switch billing cycle and re-render
 */
function switchBillingCycle(cycle) {
	_currentBillingCycle = cycle;
	initPricing(); // re-render
}

/**
 * Initialize pricing page
 */
async function initPricing() {
	const container = document.getElementById('pricingContainer');

	if (container && !container.dataset.loaded) {
		container.innerHTML = `
			<div class="text-center py-5">
				<div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-3 text-muted">Loading pricing...</p>
			</div>
		`;
	}

	const config = await fetchPricingConfig();
	renderPricingTabs(config);

	if (container) container.dataset.loaded = 'true';

	// Re-init WOW animations
	if (typeof WOW !== 'undefined') {
		new WOW().init();
	}
}

// Event delegation
document.addEventListener('click', function(e) {
	// Billing cycle toggle
	const billingTab = e.target.closest('.pricing-tab[data-billing]');
	if (billingTab) {
		switchBillingCycle(billingTab.dataset.billing);
		return;
	}

	// GA4 tracking for CTA clicks
	const pricingBtn = e.target.closest('.btn-pricing');
	if (pricingBtn && typeof gtag === 'function') {
		const planId = pricingBtn.dataset.planId || 'unknown';
		gtag('event', 'begin_checkout', {
			event_category: 'pricing',
			event_label: planId,
			value: 1,
		});
	}
});

// Auto-init
document.addEventListener('DOMContentLoaded', function() {
	initPricing();
});

// Export
window.FlytoPrice = {
	fetchPricingConfig,
	renderPricingTabs,
	switchBillingCycle,
	handleCheckout,
	handleFreeSignup,
	FALLBACK_PRICING,
};
