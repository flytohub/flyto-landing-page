/**
 * Flyto2 Dynamic Pricing Configuration
 * Reads pricing settings from Firestore and renders dynamically
 */

/**
 * IMPORTANT: Keep this fallback in sync with Firestore settings.pricing_v1
 * Last updated: 2024-12-29
 *
 * To update:
 * 1. Update Firestore first via admin panel
 * 2. Then update this fallback
 * 3. Update the date above
 */
const FALLBACK_PRICING = {
	_lastUpdated: '2024-12-29',
	version: 1,
	sections: [
		{
			key: "cloud_saas",
			title: "Cloud (SaaS)",
			enabled: false,
			comingSoon: true,
			badge: "Coming Soon",
			description: "Cloud version is in development. Join the waitlist to get early access.",
			cta: { type: "waitlist", label: "Join Waitlist" },
			plans: []
		},
		{
			key: "pro",
			title: "Pro",
			enabled: false,
			comingSoon: true,
			badge: "Coming Soon",
			description: "Pro features are coming soon. Stay tuned!",
			cta: { type: "waitlist", label: "Get Notified" },
			plans: []
		},
		{
			key: "enterprise",
			title: "Enterprise",
			enabled: true,
			comingSoon: false,
			badge: "Contact Us",
			description: "Enterprise deployment with RBAC, audit logs, and dedicated support.",
			cta: { type: "contact", label: "Contact Sales", url: "contact.html" },
			plans: [
				{
					id: "enterprise_onprem",
					name: "Enterprise On-Prem",
					pricing_type: "contact",
					price: null,
					currency: "USD",
					features: [
						"Unlimited users",
						"RBAC permissions",
						"Audit logging",
						"Private template library",
						"Dedicated support",
						"Custom integrations"
					],
					enabled: true,
					popular: false
				}
			]
		}
	]
};

// UI Timing Constants (in milliseconds)
const UI_TIMING = {
	BUTTON_RESET_SHORT: 2000,  // Time before button resets after duplicate submission
	BUTTON_RESET_LONG: 3000,   // Time before button resets after successful submission
	WAITLIST_EXPIRY_DAYS: 30   // Days before waitlist localStorage entries expire
};

/**
 * HTML escape function to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML-safe text
 */
function escapeHtml(text) {
	if (text === null || text === undefined) return '';
	const div = document.createElement('div');
	div.textContent = String(text);
	return div.innerHTML;
}

/**
 * Clean up expired waitlist entries from localStorage
 * Entries older than 30 days are removed to prevent localStorage bloat
 */
function cleanupWaitlistStorage() {
	const EXPIRY_MS = UI_TIMING.WAITLIST_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
	const now = Date.now();
	const keysToRemove = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith('waitlist_')) {
			try {
				const timestamp = parseInt(localStorage.getItem(key), 10);
				if (isNaN(timestamp) || (now - timestamp) > EXPIRY_MS) {
					keysToRemove.push(key);
				}
			} catch (e) {
				// Remove malformed entries
				keysToRemove.push(key);
			}
		}
	}

	keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Convert API pricing response to config format
 * 2.1 Logic fix: Unified pricing source via Cloud Function
 */
function convertApiPricingToConfig(apiPricing) {
	// If API returns full pricing_v1 format, use it directly
	if (apiPricing.sections) {
		return apiPricing;
	}

	// Otherwise, convert from legacy API format
	return {
		version: 1,
		sections: [
			{
				key: "cloud_saas",
				title: "Cloud (SaaS)",
				enabled: false,
				comingSoon: true,
				badge: "Coming Soon",
				description: "Cloud version is in development. Join the waitlist to get early access.",
				cta: { type: "waitlist", label: "Join Waitlist" },
				plans: []
			},
			{
				key: "pro",
				title: "Pro",
				enabled: false,
				comingSoon: true,
				badge: "Coming Soon",
				description: "Pro features are coming soon. Stay tuned!",
				cta: { type: "waitlist", label: "Get Notified" },
				plans: []
			},
			{
				key: "enterprise",
				title: "Enterprise",
				enabled: true,
				comingSoon: false,
				badge: "Contact Us",
				description: "Enterprise deployment with RBAC, audit logs, and dedicated support.",
				cta: { type: "contact", label: "Contact Sales", url: "contact.html" },
				plans: [
					{
						id: "enterprise_onprem",
						name: "Enterprise On-Prem",
						pricing_type: "contact",
						price: null,
						currency: "USD",
						features: [
							"Unlimited users",
							"RBAC permissions",
							"Audit logging",
							"Private template library",
							"Dedicated support",
							"Custom integrations"
						],
						enabled: true,
						popular: false
					}
				]
			}
		]
	};
}

/**
 * Fetch pricing config from Cloud Function or Firestore
 */
async function fetchPricingConfig() {
	try {
		// Try Cloud Function API first
		if (typeof window.FlytoAuth !== 'undefined' && window.FlytoAuth.FIREBASE_URL) {
			try {
				const response = await fetch(`${window.FlytoAuth.FIREBASE_URL}/getPricing`);
				const data = await response.json();
				if (data.ok && data.pricing) {
					return convertApiPricingToConfig(data.pricing);
				}
			} catch (apiError) {
				console.warn('Cloud Function API failed, falling back to Firestore:', apiError);
			}
		}

		// Fallback: Check if Firebase Firestore is available
		if (typeof firebase === 'undefined' || !firebase.firestore) {
			console.warn('Firebase not available, using fallback pricing');
			return FALLBACK_PRICING;
		}

		const db = firebase.firestore();

		// Try new pricing_v1 format first
		const v1Doc = await db.collection('settings').doc('pricing_v1').get();
		if (v1Doc.exists) {
			const data = v1Doc.data();
			return data;
		}

		// Try legacy offline_pricing format (from AdminPricing.vue)
		const legacyDoc = await db.collection('settings').doc('offline_pricing').get();
		if (legacyDoc.exists) {
			const legacyData = legacyDoc.data();
			return convertLegacyPricing(legacyData);
		}

		// No pricing config found - use fallback silently
		return FALLBACK_PRICING;
	} catch (error) {
		// Fetch error - use fallback silently
		return FALLBACK_PRICING;
	}
}

/**
 * Convert legacy offline_pricing format to new pricing_v1 format
 */
function convertLegacyPricing(legacy) {
	// Build new format
	const config = {
		version: 1,
		sections: [
			// Cloud SaaS - Coming Soon
			{
				key: "cloud_saas",
				title: "Cloud (SaaS)",
				enabled: false,
				comingSoon: true,
				badge: "Coming Soon",
				description: "Cloud version is in development. Join the waitlist to get early access.",
				cta: { type: "waitlist", label: "Join Waitlist" },
				plans: []
			},
			// Pro - Coming Soon
			{
				key: "pro",
				title: "Pro",
				enabled: false,
				comingSoon: true,
				badge: "Coming Soon",
				description: "Pro features are coming soon. Stay tuned!",
				cta: { type: "waitlist", label: "Get Notified" },
				plans: []
			},
			// Enterprise
			{
				key: "enterprise",
				title: "Enterprise",
				enabled: true,
				comingSoon: false,
				badge: "Contact Us",
				description: "Enterprise deployment with RBAC, audit logs, and dedicated support.",
				cta: { type: "contact", label: "Contact Sales", url: "contact.html" },
				plans: [
					{
						id: "enterprise_onprem",
						name: "Enterprise On-Prem",
						pricing_type: "contact",
						price: null,
						currency: "USD",
						features: [
							"Unlimited users",
							"RBAC permissions",
							"Audit logging",
							"Private template library",
							"Dedicated support",
							"Custom integrations"
						],
						enabled: true,
						popular: false
					}
				]
			}
		]
	};

	return config;
}

/**
 * Format price for display
 */
function formatPrice(price, currency = 'USD') {
	if (price === null || price === undefined) {
		return null;
	}
	const symbols = { USD: '$', TWD: 'NT$', EUR: '€', GBP: '£' };
	const symbol = symbols[currency] || '$';
	return { symbol, amount: price.toLocaleString() };
}

/**
 * Get billing period text
 */
function getBillingText(billing, period) {
	const texts = {
		'one_time': period === 'lifetime' ? 'lifetime license' : 'one-time',
		'monthly': '/month',
		'yearly': '/year',
		'custom': 'custom pricing'
	};
	return texts[billing] || '';
}

/**
 * Format enterprise pricing display
 */
function formatEnterprisePricing(plan) {
	const pricingType = plan.pricing_type || 'contact';
	const currency = plan.currency || 'USD';
	const symbols = { USD: '$', TWD: 'NT$', EUR: '€', GBP: '£' };
	const symbol = symbols[currency] || '$';

	if (pricingType === 'contact') {
		return {
			main: 'Contact Us',
			sub: 'Custom pricing for your organization'
		};
	}

	if (pricingType === 'per_seat') {
		const basePrice = plan.base_price || 0;
		const perSeat = plan.per_seat_price || 0;
		const included = plan.included_seats || 5;
		return {
			main: `Starting at ${symbol}${basePrice.toLocaleString()}`,
			sub: `${included} users included, +${symbol}${perSeat}/user`
		};
	}

	if (pricingType === 'tiered' && plan.tiers?.length) {
		const firstTier = plan.tiers[0];
		return {
			main: `From ${symbol}${firstTier.price?.toLocaleString() || '0'}`,
			sub: `Up to ${firstTier.max_users} users`
		};
	}

	return { main: 'Contact Us', sub: '' };
}

/**
 * Render a single plan card
 */
function renderPlanCard(plan, sectionCta, sectionKey) {
	const isEnterprise = sectionKey === 'enterprise';
	const priceInfo = isEnterprise ? null : formatPrice(plan.price, plan.currency);
	const billingText = isEnterprise ? '' : getBillingText(plan.billing, plan.period);
	const isPopular = plan.popular;
	const isContact = plan.price === null || plan.billing === 'custom' || plan.pricing_type === 'contact';

	let priceDisplay = '';
	let periodDisplay = '';

	if (isEnterprise) {
		const enterprisePrice = formatEnterprisePricing(plan);
		priceDisplay = `<span style="font-size: 28px;">${enterprisePrice.main}</span>`;
		periodDisplay = enterprisePrice.sub;
	} else if (isContact) {
		priceDisplay = '<span style="font-size: 32px;">Contact Us</span>';
		periodDisplay = 'custom pricing';
	} else {
		priceDisplay = `<span class="price-currency">${priceInfo.symbol}</span>${priceInfo.amount}`;
		periodDisplay = billingText;
	}

	// XSS protection: escape all user-controlled content
	const featuresHtml = (plan.features || []).map(f => `
		<li class="pricing-feature-item">
			<i class="bi bi-check-circle-fill feature-icon"></i>
			<span>${escapeHtml(f)}</span>
		</li>
	`).join('');

	const ctaUrl = escapeHtml(sectionCta.url || '#');
	const ctaLabel = escapeHtml(isContact ? (sectionCta.label || 'Contact Sales') : sectionCta.label);
	const escapedPlanName = escapeHtml(plan.name || '');

	return `
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="pricing-card-3d ${isPopular ? 'pricing-card-popular' : ''} wow fadeInUp">
				${isPopular ? '<div class="popular-badge"><i class="bi bi-star-fill"></i> Most Popular</div>' : ''}
				<div class="pricing-card-title">${escapedPlanName.toUpperCase()}</div>
				<div class="price-animated">
					${priceDisplay}
				</div>
				<div class="price-period">${escapeHtml(periodDisplay)}</div>
				<ul class="pricing-feature-list">
					${featuresHtml}
				</ul>
				<a href="${ctaUrl}" class="btn-pricing">${ctaLabel}</a>
			</div>
		</div>
	`;
}

/**
 * Render Coming Soon card with XSS protection
 */
function renderComingSoonCard(section) {
	const badge = escapeHtml(section.badge);
	const title = escapeHtml(section.title);
	const description = escapeHtml(section.description);
	const sectionKey = escapeHtml(section.key);
	const ctaLabel = escapeHtml(section.cta.label);
	const ctaUrl = escapeHtml(section.cta.url || '#');

	return `
		<div class="col-lg-6 col-md-8 mx-auto mb-4">
			<div class="pricing-card-3d coming-soon-card wow fadeInUp">
				<div class="coming-soon-badge">${badge}</div>
				<h3 class="coming-soon-title">${title}</h3>
				<p class="coming-soon-desc">${description}</p>
				${section.cta.type === 'waitlist' ? `
					<form class="waitlist-form" onsubmit="handleWaitlist(event, '${sectionKey}')">
						<div class="input-group">
							<input type="email" class="form-control" placeholder="Enter your email" required>
							<button type="submit" class="btn-waitlist">${ctaLabel}</button>
						</div>
					</form>
				` : `
					<a href="${ctaUrl}" class="btn-pricing">${ctaLabel}</a>
				`}
			</div>
		</div>
	`;
}

/**
 * Render a full section
 */
function renderSection(section) {
	// Hidden section
	if (!section.enabled && !section.comingSoon) {
		return '';
	}

	// Coming Soon section
	if (!section.enabled && section.comingSoon) {
		return renderComingSoonCard(section);
	}

	// Enabled section with plans
	const plansHtml = (section.plans || [])
		.filter(p => p.enabled !== false)
		.map(p => renderPlanCard(p, section.cta, section.key))
		.join('');

	return plansHtml;
}

/**
 * Render all pricing sections
 */
function renderPricingTabs(config) {
	const container = document.getElementById('pricingContainer');
	if (!container) return;

	const sections = (config.sections || []).filter(s => s.key !== 'offline');

	// Render all enabled sections directly (no tabs)
	let sectionsContent = '';
	sections.forEach(section => {
		sectionsContent += renderSection(section);
	});

	const html = `
		<div class="row justify-content-center">
			${sectionsContent || '<div class="col-12 text-center text-muted">No plans available</div>'}
		</div>
	`;

	container.innerHTML = html;
}

/**
 * Switch between pricing tabs (kept for API compatibility)
 */
function switchPricingTab(tab) {
	// Update tab buttons
	document.querySelectorAll('.pricing-tab').forEach(btn => {
		btn.classList.remove('active');
		btn.setAttribute('aria-selected', 'false');
		if (btn.dataset.tab === tab) {
			btn.classList.add('active');
			btn.setAttribute('aria-selected', 'true');
		}
	});

	// Update tab content
	document.querySelectorAll('.pricing-tab-content').forEach(content => {
		content.style.display = 'none';
	});

	const targetTab = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
	if (targetTab) {
		targetTab.style.display = 'block';
	}
}

/**
 * Handle waitlist form submission with validation and duplicate prevention
 */
async function handleWaitlist(event, sectionKey) {
	event.preventDefault();
	const form = event.target;
	const emailInput = form.querySelector('input[type="email"]');
	const email = emailInput.value.trim();
	const btn = form.querySelector('button');

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || !emailRegex.test(email)) {
		alert('Please enter a valid email address');
		return;
	}

	// Duplicate submission prevention (check localStorage)
	const waitlistKey = `waitlist_${sectionKey}_${email}`;
	if (localStorage.getItem(waitlistKey)) {
		btn.innerHTML = '<i class="bi bi-check"></i> Already Joined!';
		btn.classList.add('btn-success');
		setTimeout(() => {
			btn.innerHTML = 'Join Waitlist';
			btn.classList.remove('btn-success');
		}, UI_TIMING.BUTTON_RESET_SHORT);
		return;
	}

	btn.disabled = true;
	btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

	try {
		// Save to Firestore waitlist collection
		if (typeof firebase !== 'undefined' && firebase.firestore) {
			const db = firebase.firestore();
			await db.collection('waitlist').add({
				email: email,
				section: sectionKey,
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			});
		}

		// Mark as submitted in localStorage
		localStorage.setItem(waitlistKey, Date.now().toString());

		btn.innerHTML = '<i class="bi bi-check"></i> Added!';
		btn.classList.add('btn-success');
		emailInput.value = '';

		setTimeout(() => {
			btn.innerHTML = 'Join Waitlist';
			btn.classList.remove('btn-success');
			btn.disabled = false;
		}, UI_TIMING.BUTTON_RESET_LONG);

	} catch (error) {
		btn.innerHTML = 'Try Again';
		btn.disabled = false;
	}
}

/**
 * 3.1 Enhancement: Initialize pricing page with loading state
 */
async function initPricing() {
	const container = document.getElementById('pricingContainer');

	// Show loading state
	if (container) {
		container.innerHTML = `
			<div class="text-center py-5">
				<div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-3 text-muted">Loading pricing information...</p>
			</div>
		`;
	}

	const config = await fetchPricingConfig();
	renderPricingTabs(config);

	// Re-init WOW animations if available
	if (typeof WOW !== 'undefined') {
		new WOW().init();
	}
}

// Event delegation for pricing tabs (no inline onclick)
document.addEventListener('click', function(e) {
	const tab = e.target.closest('.pricing-tab');
	if (tab && tab.dataset.tab) {
		switchPricingTab(tab.dataset.tab);
	}

	// GA4: Track pricing CTA clicks
	const pricingBtn = e.target.closest('.btn-pricing');
	if (pricingBtn && typeof gtag === 'function') {
		const card = pricingBtn.closest('.pricing-card-3d');
		const planName = card ? card.querySelector('.pricing-card-title')?.textContent?.trim() : 'unknown';
		gtag('event', 'begin_checkout', {
			event_category: 'pricing',
			event_label: planName,
			value: 1
		});
	}
});

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
	// Clean up expired waitlist entries
	cleanupWaitlistStorage();
	// Initialize pricing
	initPricing();
});

// Export for global access
window.FlytoPrice = {
	fetchPricingConfig,
	renderPricingTabs,
	switchPricingTab,
	handleWaitlist,
	FALLBACK_PRICING
};
