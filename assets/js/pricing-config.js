/**
 * Flyto2 Dynamic Pricing Configuration
 * Reads pricing settings from Firestore and renders dynamically
 */

// Fallback config when Firestore is unavailable
const FALLBACK_PRICING = {
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
			key: "offline",
			title: "Offline License",
			enabled: true,
			comingSoon: false,
			badge: "Available",
			description: "Perpetual license for air-gapped and secure environments.",
			cta: { type: "buy", label: "Buy Now", url: "buy-offline.html" },
			plans: [
				{
					id: "offline_pro",
					name: "Pro Offline",
					price: 199,
					currency: "USD",
					billing: "one_time",
					period: "lifetime",
					features: [
						"Offline execution",
						"License file activation",
						"1 year updates included",
						"Email support"
					],
					enabled: true,
					popular: true
				}
			]
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

/**
 * Fetch pricing config from Firestore
 * Supports new pricing_v1 format and legacy offline_pricing format
 */
async function fetchPricingConfig() {
	try {
		// Check if Firebase is initialized
		if (typeof firebase === 'undefined' || !firebase.firestore) {
			console.warn('Firebase not available, using fallback pricing');
			return FALLBACK_PRICING;
		}

		const db = firebase.firestore();

		// Try new pricing_v1 format first
		const v1Doc = await db.collection('settings').doc('pricing_v1').get();
		if (v1Doc.exists) {
			const data = v1Doc.data();
			console.log('Loaded pricing_v1 config from Firestore');
			return data;
		}

		// Try legacy offline_pricing format (from AdminPricing.vue)
		const legacyDoc = await db.collection('settings').doc('offline_pricing').get();
		if (legacyDoc.exists) {
			const legacyData = legacyDoc.data();
			console.log('Converting legacy offline_pricing to new format');
			return convertLegacyPricing(legacyData);
		}

		console.warn('No pricing config found, using fallback');
		return FALLBACK_PRICING;
	} catch (error) {
		console.error('Error fetching pricing config:', error);
		return FALLBACK_PRICING;
	}
}

/**
 * Convert legacy offline_pricing format to new pricing_v1 format
 */
function convertLegacyPricing(legacy) {
	const plans = legacy.plans || {};
	const proOffline = plans.pro_offline;

	if (!proOffline) {
		return FALLBACK_PRICING;
	}

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
			// Offline License - From AdminPricing
			{
				key: "offline",
				title: "Offline License",
				enabled: true,
				comingSoon: false,
				badge: "Available",
				description: "Perpetual license for air-gapped and secure environments.",
				cta: { type: "buy", label: "Buy Now", url: "buy-offline.html" },
				plans: [
					{
						id: "offline_pro",
						name: proOffline.display_price ? `Pro Offline` : "Pro Offline",
						price: (proOffline.price || 19900) / 100,
						currency: (proOffline.currency || 'usd').toUpperCase(),
						billing: proOffline.period === 'lifetime' ? 'one_time' : 'yearly',
						period: proOffline.period || 'year',
						features: proOffline.features || [
							"Offline execution",
							"License file activation",
							"1 year updates included",
							"Email support"
						],
						enabled: true,
						popular: true
					}
				]
			},
			// Enterprise Offline
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

	const featuresHtml = (plan.features || []).map(f => `
		<li class="pricing-feature-item">
			<i class="bi bi-check-circle-fill feature-icon"></i>
			<span>${f}</span>
		</li>
	`).join('');

	const ctaUrl = sectionCta.url || '#';
	const ctaLabel = isContact ? (sectionCta.label || 'Contact Sales') : sectionCta.label;

	return `
		<div class="col-lg-4 col-md-6 mb-4">
			<div class="pricing-card-3d ${isPopular ? 'pricing-card-popular' : ''} wow fadeInUp">
				${isPopular ? '<div class="popular-badge"><i class="bi bi-star-fill"></i> Most Popular</div>' : ''}
				<div class="pricing-card-title">${plan.name.toUpperCase()}</div>
				<div class="price-animated">
					${priceDisplay}
				</div>
				<div class="price-period">${periodDisplay}</div>
				<ul class="pricing-feature-list">
					${featuresHtml}
				</ul>
				<a href="${ctaUrl}" class="btn-pricing">${ctaLabel}</a>
			</div>
		</div>
	`;
}

/**
 * Render Coming Soon card
 */
function renderComingSoonCard(section) {
	return `
		<div class="col-lg-6 col-md-8 mx-auto mb-4">
			<div class="pricing-card-3d coming-soon-card wow fadeInUp">
				<div class="coming-soon-badge">${section.badge}</div>
				<h3 class="coming-soon-title">${section.title}</h3>
				<p class="coming-soon-desc">${section.description}</p>
				${section.cta.type === 'waitlist' ? `
					<form class="waitlist-form" onsubmit="handleWaitlist(event, '${section.key}')">
						<div class="input-group">
							<input type="email" class="form-control" placeholder="Enter your email" required>
							<button type="submit" class="btn-waitlist">${section.cta.label}</button>
						</div>
					</form>
				` : `
					<a href="${section.cta.url || '#'}" class="btn-pricing">${section.cta.label}</a>
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
 * Render all pricing sections into tabs
 */
function renderPricingTabs(config) {
	const container = document.getElementById('pricingContainer');
	if (!container) return;

	// Separate sections into categories
	const cloudSections = (config.sections || []).filter(s =>
		['cloud_saas', 'pro'].includes(s.key)
	);
	const offlineSections = (config.sections || []).filter(s =>
		['offline', 'enterprise'].includes(s.key)
	);

	// Check if cloud has any enabled plans
	const hasCloudPlans = cloudSections.some(s => s.enabled && s.plans?.length > 0);

	// Render Cloud tab content
	let cloudContent = '';
	cloudSections.forEach(section => {
		cloudContent += renderSection(section);
	});

	// Render Offline tab content
	let offlineContent = '';
	offlineSections.forEach(section => {
		offlineContent += renderSection(section);
	});

	// Build tabs HTML
	const html = `
		<div class="pricing-tabs-wrapper">
			<div class="pricing-tab-buttons">
				<button class="pricing-tab ${!hasCloudPlans ? '' : 'active'}" data-tab="cloud" onclick="switchPricingTab('cloud')">
					<i class="bi bi-cloud"></i> Cloud
				</button>
				<button class="pricing-tab ${!hasCloudPlans ? 'active' : ''}" data-tab="offline" onclick="switchPricingTab('offline')">
					<i class="bi bi-hdd"></i> Offline License
				</button>
			</div>
		</div>

		<div class="pricing-tab-content" id="tabCloud" style="display: ${!hasCloudPlans ? 'none' : 'block'}">
			<div class="row justify-content-center">
				${cloudContent || '<div class="col-12 text-center text-muted">No plans available</div>'}
			</div>
		</div>

		<div class="pricing-tab-content" id="tabOffline" style="display: ${!hasCloudPlans ? 'block' : 'none'}">
			<div class="row justify-content-center">
				${offlineContent || '<div class="col-12 text-center text-muted">No plans available</div>'}
			</div>
		</div>
	`;

	container.innerHTML = html;
}

/**
 * Switch between pricing tabs
 */
function switchPricingTab(tab) {
	// Update tab buttons
	document.querySelectorAll('.pricing-tab').forEach(btn => {
		btn.classList.remove('active');
		if (btn.dataset.tab === tab) {
			btn.classList.add('active');
		}
	});

	// Update tab content
	document.querySelectorAll('.pricing-tab-content').forEach(content => {
		content.style.display = 'none';
	});

	const targetTab = document.getElementById(tab === 'cloud' ? 'tabCloud' : 'tabOffline');
	if (targetTab) {
		targetTab.style.display = 'block';
	}
}

/**
 * Handle waitlist form submission
 */
async function handleWaitlist(event, sectionKey) {
	event.preventDefault();
	const form = event.target;
	const email = form.querySelector('input[type="email"]').value;
	const btn = form.querySelector('button');

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

		btn.innerHTML = '<i class="bi bi-check"></i> Added!';
		btn.classList.add('btn-success');
		form.querySelector('input').value = '';

		setTimeout(() => {
			btn.innerHTML = 'Join Waitlist';
			btn.classList.remove('btn-success');
			btn.disabled = false;
		}, 3000);

	} catch (error) {
		console.error('Waitlist error:', error);
		btn.innerHTML = 'Try Again';
		btn.disabled = false;
	}
}

/**
 * Initialize pricing page
 */
async function initPricing() {
	const config = await fetchPricingConfig();
	renderPricingTabs(config);

	// Re-init WOW animations if available
	if (typeof WOW !== 'undefined') {
		new WOW().init();
	}
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', initPricing);

// Export for global access
window.FlytoPrice = {
	fetchPricingConfig,
	renderPricingTabs,
	switchPricingTab,
	handleWaitlist,
	FALLBACK_PRICING
};
