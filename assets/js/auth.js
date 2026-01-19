/**
 * Flyto2 Shared Authentication Module
 * Include this file on all pages that need authentication
 *
 * Public API exposed via window.FlytoAuth:
 * - getCurrentUser(): Get current authenticated user
 * - isLoggedIn(): Check if user is logged in
 * - getIdToken(): Get Firebase ID token for API calls
 * - showAuthModal(): Show the authentication modal
 * - hideAuthModal(): Hide the authentication modal
 * - handleSignOut(): Sign out the current user
 * - FIREBASE_URL: Firebase Functions base URL
 */
(function() {
'use strict';

// Firebase Configuration (private)
const firebaseConfig = {
	apiKey: "AIzaSyCKXJNd28MRs0yDQHK3xZKlJkIqv0MbxZE",
	authDomain: "ticket-helper-dbc0e.firebaseapp.com",
	projectId: "ticket-helper-dbc0e",
	storageBucket: "ticket-helper-dbc0e.firebasestorage.app",
	messagingSenderId: "697135540741",
	appId: "1:697135540741:web:e6aba1e3f1c7a4f7c6b9a8"
};

// Firebase Functions URL
const FIREBASE_URL = 'https://us-central1-ticket-helper-dbc0e.cloudfunctions.net';

// Initialize Firebase (only once)
if (!window.firebaseInitialized) {
	firebase.initializeApp(firebaseConfig);
	window.firebaseInitialized = true;
}
const auth = firebase.auth();

// Current user state
let currentUser = null;

// Rate limiting configuration
const RATE_LIMIT_KEY = 'flyto_auth_rate_limit';
const MAX_LOGIN_ATTEMPTS = 5;
const BASE_LOCKOUT_MS = 30000; // 30 seconds base lockout

/**
 * Get rate limit state from localStorage
 */
function getRateLimitState() {
	try {
		const stored = localStorage.getItem(RATE_LIMIT_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		// Ignore parsing errors
	}
	return { attempts: 0, lockedUntil: 0 };
}

/**
 * Save rate limit state to localStorage
 */
function setRateLimitState(state) {
	try {
		localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
	} catch (e) {
		// Ignore storage errors
	}
}

/**
 * Check if login is currently rate limited
 * Returns { limited: boolean, remainingMs: number }
 */
function checkRateLimit() {
	const state = getRateLimitState();
	const now = Date.now();

	if (state.lockedUntil > now) {
		return { limited: true, remainingMs: state.lockedUntil - now };
	}

	// Reset attempts if lockout has expired
	if (state.lockedUntil > 0 && state.lockedUntil <= now) {
		setRateLimitState({ attempts: 0, lockedUntil: 0 });
	}

	return { limited: false, remainingMs: 0 };
}

/**
 * Record a failed login attempt and apply exponential backoff
 */
function recordFailedAttempt() {
	const state = getRateLimitState();
	state.attempts += 1;

	if (state.attempts >= MAX_LOGIN_ATTEMPTS) {
		// Exponential backoff: 30s, 60s, 120s, 240s...
		const lockoutMultiplier = Math.pow(2, Math.floor(state.attempts / MAX_LOGIN_ATTEMPTS) - 1);
		state.lockedUntil = Date.now() + (BASE_LOCKOUT_MS * lockoutMultiplier);
	}

	setRateLimitState(state);
}

/**
 * Reset rate limit on successful login
 */
function resetRateLimit() {
	setRateLimitState({ attempts: 0, lockedUntil: 0 });
}

/**
 * Initialize authentication UI and handlers
 * Call this on DOMContentLoaded
 */
function initAuth() {
	setupAuthStateListener();
	setupAuthHandlers();
	injectAuthModal();
}

/**
 * Inject the auth modal HTML if not present
 */
function injectAuthModal() {
	if (document.getElementById('authModal')) return;

	const modalHTML = `
	<div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true" aria-labelledby="authModalTitle" role="dialog">
		<div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
			<div class="modal-content auth-modal-content" role="document">
				<button type="button" class="btn-close auth-modal-close" data-bs-dismiss="modal" aria-label="Close authentication dialog"></button>

				<!-- Logo -->
				<div class="auth-modal-logo">
					<img src="/assets/img/logo.png" alt="Flyto2 Logo" style="height: 40px;">
				</div>

				<!-- Modal Title (visually hidden for screen readers) -->
				<h2 id="authModalTitle" class="visually-hidden">Sign In or Create Account</h2>

				<!-- Tab Switcher -->
				<div class="auth-tabs" role="tablist" aria-label="Authentication options">
					<button class="auth-tab active" id="tabLogin" role="tab" aria-selected="true" aria-controls="loginForm">Sign In</button>
					<button class="auth-tab" id="tabRegister" role="tab" aria-selected="false" aria-controls="registerForm">Sign Up</button>
				</div>

				<div class="auth-modal-body">
					<!-- Login Form -->
					<div id="loginForm" role="tabpanel" aria-labelledby="tabLogin">
						<div class="auth-input-group">
							<label class="auth-label" for="authEmail">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope" aria-hidden="true"></i>
								<input type="email" class="auth-input" id="authEmail" placeholder="your@email.com" required autocomplete="email" aria-describedby="authError">
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label" for="authPassword">Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock" aria-hidden="true"></i>
								<input type="password" class="auth-input" id="authPassword" placeholder="Enter password" required autocomplete="current-password" aria-describedby="authError">
							</div>
						</div>
						<div class="auth-forgot">
							<a href="#" id="showForgotPassword">Forgot password?</a>
						</div>
						<div id="authError" class="auth-error d-none" role="alert" aria-live="polite"></div>
						<button class="auth-btn" id="btnLogin" type="button">
							<span id="loginBtnText">Sign In</span>
							<span id="loginBtnSpinner" class="spinner-border spinner-border-sm d-none ms-2" aria-hidden="true"></span>
						</button>
					</div>

					<!-- Register Form -->
					<div id="registerForm" class="d-none" role="tabpanel" aria-labelledby="tabRegister">
						<div class="auth-input-group">
							<label class="auth-label" for="registerUsername">Username</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-person" aria-hidden="true"></i>
								<input type="text" class="auth-input" id="registerUsername" placeholder="Your display name" required autocomplete="username" aria-describedby="registerError">
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label" for="registerEmail">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope" aria-hidden="true"></i>
								<input type="email" class="auth-input" id="registerEmail" placeholder="your@email.com" required autocomplete="email" aria-describedby="registerError">
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label" for="registerPassword">Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock" aria-hidden="true"></i>
								<input type="password" class="auth-input" id="registerPassword" placeholder="At least 6 characters" required autocomplete="new-password" aria-describedby="registerError">
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label" for="registerPasswordConfirm">Confirm Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock-fill" aria-hidden="true"></i>
								<input type="password" class="auth-input" id="registerPasswordConfirm" placeholder="Confirm password" required autocomplete="new-password" aria-describedby="registerError">
							</div>
						</div>
						<div id="registerError" class="auth-error d-none" role="alert" aria-live="polite"></div>
						<button class="auth-btn" id="btnRegister" type="button">
							<span id="registerBtnText">Create Account</span>
							<span id="registerBtnSpinner" class="spinner-border spinner-border-sm d-none ms-2" aria-hidden="true"></span>
						</button>
						<p class="auth-terms">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
					</div>

					<!-- Forgot Password Form -->
					<div id="forgotPasswordForm" class="d-none" role="form" aria-label="Password reset form">
						<div class="auth-back">
							<a href="#" id="backToLogin"><i class="bi bi-arrow-left" aria-hidden="true"></i> Back to sign in</a>
						</div>
						<h5 class="auth-subtitle" id="forgotFormTitle">Reset Password</h5>
						<p class="auth-desc">Enter your email and we'll send you a reset link.</p>
						<div class="auth-input-group">
							<label class="auth-label" for="forgotEmail">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope" aria-hidden="true"></i>
								<input type="email" class="auth-input" id="forgotEmail" placeholder="your@email.com" required autocomplete="email" aria-describedby="forgotError forgotSuccess">
							</div>
						</div>
						<div id="forgotError" class="auth-error d-none" role="alert" aria-live="polite"></div>
						<div id="forgotSuccess" class="auth-success d-none" role="status" aria-live="polite"></div>
						<button class="auth-btn" id="btnForgot" type="button">Send Reset Link</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;

	document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Auth State Listener
 */
function setupAuthStateListener() {
	auth.onAuthStateChanged((user) => {
		currentUser = user;
		updateAuthUI(user);
		// Dispatch custom event for page-specific handling
		window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user } }));
	});
}

/**
 * Update UI based on auth state
 */
function updateAuthUI(user) {
	const headerLoginBtn = document.getElementById('headerLoginBtn');
	const headerUserDropdown = document.getElementById('headerUserDropdown');
	const headerUserEmail = document.getElementById('headerUserEmail');
	const headerUserAvatar = document.getElementById('headerUserAvatar');

	if (user) {
		// User is signed in
		if (headerLoginBtn) headerLoginBtn.classList.add('d-none');
		if (headerUserDropdown) {
			headerUserDropdown.classList.remove('d-none');
			// Prefer displayName (username), fallback to email
			const displayText = user.displayName || user.email;
			if (headerUserEmail) headerUserEmail.textContent = displayText;
			if (headerUserAvatar) {
				// Get first letter of displayName or email for avatar
				headerUserAvatar.textContent = displayText.charAt(0).toUpperCase();
			}
		}
	} else {
		// User is signed out
		if (headerLoginBtn) headerLoginBtn.classList.remove('d-none');
		if (headerUserDropdown) headerUserDropdown.classList.add('d-none');
	}
}

// Track element that triggered modal for focus restoration
let previousActiveElement = null;

/**
 * Show auth modal with focus management
 */
function showAuthModal() {
	// Store the element that triggered the modal
	previousActiveElement = document.activeElement;

	const modalEl = document.getElementById('authModal');
	const modal = new bootstrap.Modal(modalEl);
	modal.show();

	// Focus the first input after modal is shown
	modalEl.addEventListener('shown.bs.modal', function onShown() {
		const firstInput = modalEl.querySelector('input:not([type="hidden"])');
		if (firstInput) firstInput.focus();
		modalEl.removeEventListener('shown.bs.modal', onShown);
	}, { once: true });
}

/**
 * Hide auth modal and restore focus
 */
function hideAuthModal() {
	const modalEl = document.getElementById('authModal');
	const modal = bootstrap.Modal.getInstance(modalEl);
	if (modal) {
		modal.hide();
		// Restore focus after modal is hidden
		modalEl.addEventListener('hidden.bs.modal', function onHidden() {
			if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
				previousActiveElement.focus();
			}
			previousActiveElement = null;
			modalEl.removeEventListener('hidden.bs.modal', onHidden);
		}, { once: true });
	}
}

/**
 * Form Switchers
 */
function showLoginForm() {
	document.getElementById('loginForm').classList.remove('d-none');
	document.getElementById('registerForm').classList.add('d-none');
	document.getElementById('forgotPasswordForm').classList.add('d-none');
	// Show tabs when on login/register forms
	const tabs = document.querySelector('.auth-tabs');
	if (tabs) tabs.style.display = 'flex';
	clearAuthErrors();
}

function showRegisterForm() {
	document.getElementById('loginForm').classList.add('d-none');
	document.getElementById('registerForm').classList.remove('d-none');
	document.getElementById('forgotPasswordForm').classList.add('d-none');
	// Show tabs when on login/register forms
	const tabs = document.querySelector('.auth-tabs');
	if (tabs) tabs.style.display = 'flex';
	clearAuthErrors();
}

function showForgotPasswordForm() {
	document.getElementById('loginForm').classList.add('d-none');
	document.getElementById('registerForm').classList.add('d-none');
	document.getElementById('forgotPasswordForm').classList.remove('d-none');
	// Hide tabs on forgot password form
	const tabs = document.querySelector('.auth-tabs');
	if (tabs) tabs.style.display = 'none';
	clearAuthErrors();
}

function clearAuthErrors() {
	const errorIds = ['authError', 'registerError', 'forgotError', 'forgotSuccess'];
	errorIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) el.classList.add('d-none');
	});
}

function showError(elementId, message) {
	const el = document.getElementById(elementId);
	if (el) {
		el.textContent = message;
		el.classList.remove('d-none');
	}
}

/**
 * Login Handler with rate limiting
 */
async function handleLogin() {
	const email = document.getElementById('authEmail').value.trim();
	const password = document.getElementById('authPassword').value;
	const btn = document.getElementById('btnLogin');
	const btnText = document.getElementById('loginBtnText');
	const spinner = document.getElementById('loginBtnSpinner');

	// Check rate limit before attempting login
	const rateLimit = checkRateLimit();
	if (rateLimit.limited) {
		const seconds = Math.ceil(rateLimit.remainingMs / 1000);
		showError('authError', `Too many failed attempts. Please wait ${seconds} seconds.`);
		return;
	}

	if (!email || !password) {
		showError('authError', 'Please enter email and password');
		return;
	}

	btn.disabled = true;
	btnText.textContent = 'Signing in...';
	spinner.classList.remove('d-none');
	clearAuthErrors();

	try {
		await auth.signInWithEmailAndPassword(email, password);
		resetRateLimit(); // Reset on successful login
		hideAuthModal();
	} catch (error) {
		let message = 'Login failed. Please try again.';
		if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
			recordFailedAttempt(); // Record failed attempt
			message = 'Invalid email or password';
		} else if (error.code === 'auth/invalid-email') {
			message = 'Please enter a valid email address';
		} else if (error.code === 'auth/too-many-requests') {
			message = 'Too many attempts. Please try again later.';
		}
		showError('authError', message);
	} finally {
		btn.disabled = false;
		btnText.textContent = 'Sign In';
		spinner.classList.add('d-none');
	}
}

/**
 * Register Handler
 */
async function handleRegister() {
	const username = document.getElementById('registerUsername').value.trim();
	const email = document.getElementById('registerEmail').value.trim();
	const password = document.getElementById('registerPassword').value;
	const confirmPassword = document.getElementById('registerPasswordConfirm').value;
	const btn = document.getElementById('btnRegister');
	const btnText = document.getElementById('registerBtnText');
	const spinner = document.getElementById('registerBtnSpinner');

	if (!username || !email || !password || !confirmPassword) {
		showError('registerError', 'Please fill in all fields');
		return;
	}

	if (username.length < 2) {
		showError('registerError', 'Username must be at least 2 characters');
		return;
	}

	if (password !== confirmPassword) {
		showError('registerError', 'Passwords do not match');
		return;
	}

	if (password.length < 6) {
		showError('registerError', 'Password must be at least 6 characters');
		return;
	}

	btn.disabled = true;
	btnText.textContent = 'Creating account...';
	spinner.classList.remove('d-none');
	clearAuthErrors();

	try {
		const userCredential = await auth.createUserWithEmailAndPassword(email, password);

		// Update display name in Firebase Auth
		await userCredential.user.updateProfile({
			displayName: username
		});

		// Reload to get updated profile
		await userCredential.user.reload();

		// Trigger UI update
		updateAuthUI(auth.currentUser);

		hideAuthModal();
	} catch (error) {
		let message = 'Registration failed. Please try again.';
		if (error.code === 'auth/email-already-in-use') {
			message = 'This email is already registered. Please sign in.';
		} else if (error.code === 'auth/invalid-email') {
			message = 'Please enter a valid email address';
		} else if (error.code === 'auth/weak-password') {
			message = 'Password is too weak. Use at least 6 characters.';
		}
		showError('registerError', message);
	} finally {
		btn.disabled = false;
		btnText.textContent = 'Create Account';
		spinner.classList.add('d-none');
	}
}

/**
 * Forgot Password Handler
 */
async function handleForgotPassword() {
	const email = document.getElementById('forgotEmail').value.trim();
	const btn = document.getElementById('btnForgot');

	if (!email) {
		showError('forgotError', 'Please enter your email address');
		return;
	}

	btn.disabled = true;
	btn.textContent = 'Sending...';
	clearAuthErrors();

	try {
		await auth.sendPasswordResetEmail(email);
		// Always show the same message to prevent email enumeration
		document.getElementById('forgotSuccess').textContent = 'If an account exists with this email, a reset link has been sent.';
		document.getElementById('forgotSuccess').classList.remove('d-none');
	} catch (error) {
		// Don't reveal if account exists - show generic message for user-not-found
		if (error.code === 'auth/user-not-found') {
			// Show success message even for non-existent accounts to prevent enumeration
			document.getElementById('forgotSuccess').textContent = 'If an account exists with this email, a reset link has been sent.';
			document.getElementById('forgotSuccess').classList.remove('d-none');
		} else if (error.code === 'auth/invalid-email') {
			showError('forgotError', 'Please enter a valid email address');
		} else if (error.code === 'auth/too-many-requests') {
			showError('forgotError', 'Too many requests. Please try again later.');
		} else {
			showError('forgotError', 'Unable to process request. Please try again.');
		}
	} finally {
		btn.disabled = false;
		btn.textContent = 'Send Reset Link';
	}
}

/**
 * Sign Out Handler
 */
function handleSignOut() {
	auth.signOut();
}

/**
 * Setup all event handlers
 */
function setupAuthHandlers() {
	// Wait for modal to be injected
	setTimeout(() => {
		// Login button in header
		const headerLoginBtn = document.getElementById('headerLoginBtn');
		if (headerLoginBtn) {
			headerLoginBtn.addEventListener('click', showAuthModal);
		}

		// Sign out button
		const signOutBtn = document.getElementById('btnSignOut');
		if (signOutBtn) {
			signOutBtn.addEventListener('click', handleSignOut);
		}

		// Login form
		const btnLogin = document.getElementById('btnLogin');
		if (btnLogin) {
			btnLogin.addEventListener('click', handleLogin);
		}

		const authPassword = document.getElementById('authPassword');
		if (authPassword) {
			authPassword.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') handleLogin();
			});
		}

		// Register form
		const btnRegister = document.getElementById('btnRegister');
		if (btnRegister) {
			btnRegister.addEventListener('click', handleRegister);
		}

		const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
		if (registerPasswordConfirm) {
			registerPasswordConfirm.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') handleRegister();
			});
		}

		// Forgot password form
		const btnForgot = document.getElementById('btnForgot');
		if (btnForgot) {
			btnForgot.addEventListener('click', handleForgotPassword);
		}

		const forgotEmail = document.getElementById('forgotEmail');
		if (forgotEmail) {
			forgotEmail.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') handleForgotPassword();
			});
		}

		// Tab switchers
		const tabLogin = document.getElementById('tabLogin');
		const tabRegister = document.getElementById('tabRegister');

		if (tabLogin) {
			tabLogin.addEventListener('click', () => {
				tabLogin.classList.add('active');
				tabRegister.classList.remove('active');
				showLoginForm();
			});
		}

		if (tabRegister) {
			tabRegister.addEventListener('click', () => {
				tabRegister.classList.add('active');
				tabLogin.classList.remove('active');
				showRegisterForm();
			});
		}

		const showForgotPasswordLink = document.getElementById('showForgotPassword');
		if (showForgotPasswordLink) {
			showForgotPasswordLink.addEventListener('click', (e) => {
				e.preventDefault();
				showForgotPasswordForm();
			});
		}

		const backToLoginLink = document.getElementById('backToLogin');
		if (backToLoginLink) {
			backToLoginLink.addEventListener('click', (e) => {
				e.preventDefault();
				showLoginForm();
				// Reset tabs
				if (tabLogin) tabLogin.classList.add('active');
				if (tabRegister) tabRegister.classList.remove('active');
			});
		}
	}, 100);
}

/**
 * Get current user
 */
function getCurrentUser() {
	return currentUser;
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
	return currentUser !== null;
}

/**
 * Get Firebase ID token for API calls
 */
async function getIdToken() {
	if (!currentUser) return null;
	return await currentUser.getIdToken();
}

// Event delegation for user dropdown toggle (no inline onclick needed)
document.addEventListener('click', function(e) {
	const toggle = e.target.closest('.user-dropdown-toggle');
	if (toggle) {
		const dropdown = toggle.parentElement;
		const isExpanded = dropdown.classList.toggle('show');
		toggle.setAttribute('aria-expanded', isExpanded);
		return;
	}
	// Close dropdown when clicking outside
	const dropdown = document.querySelector('.user-dropdown.show');
	if (dropdown && !dropdown.contains(e.target)) {
		dropdown.classList.remove('show');
		const toggleBtn = dropdown.querySelector('.user-dropdown-toggle');
		if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
	}
});

// Keyboard support for user dropdown toggle
document.addEventListener('keydown', function(e) {
	const toggle = e.target.closest('.user-dropdown-toggle');
	if (toggle && (e.key === 'Enter' || e.key === ' ')) {
		e.preventDefault();
		const dropdown = toggle.parentElement;
		const isExpanded = dropdown.classList.toggle('show');
		toggle.setAttribute('aria-expanded', isExpanded);
	}
	// Close on Escape
	if (e.key === 'Escape') {
		const dropdown = document.querySelector('.user-dropdown.show');
		if (dropdown) {
			dropdown.classList.remove('show');
			const toggleBtn = dropdown.querySelector('.user-dropdown-toggle');
			if (toggleBtn) {
				toggleBtn.setAttribute('aria-expanded', 'false');
				toggleBtn.focus();
			}
		}
	}
});

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export public API for global access
window.FlytoAuth = {
	getCurrentUser,
	isLoggedIn,
	getIdToken,
	showAuthModal,
	hideAuthModal,
	handleSignOut,
	FIREBASE_URL
};

})(); // End of IIFE

/**
 * Language Switcher Module
 * Auto-initializes on pages with .header-auth element
 */
(function() {
'use strict';

const LANGUAGES = [
	{ code: 'en', flag: '🇺🇸', name: 'English' },
	{ code: 'zh', flag: '🇹🇼', name: '繁體中文' },
	{ code: 'ja', flag: '🇯🇵', name: '日本語' },
	{ code: 'ko', flag: '🇰🇷', name: '한국어' },
	{ code: 'de', flag: '🇩🇪', name: 'Deutsch' },
	{ code: 'es', flag: '🇪🇸', name: 'Español' },
	{ code: 'fr', flag: '🇫🇷', name: 'Français' },
	{ code: 'it', flag: '🇮🇹', name: 'Italiano' },
	{ code: 'pt', flag: '🇧🇷', name: 'Português' },
	{ code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
	{ code: 'id', flag: '🇮🇩', name: 'Indonesia' },
	{ code: 'th', flag: '🇹🇭', name: 'ไทย' },
	{ code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
	{ code: 'pl', flag: '🇵🇱', name: 'Polski' },
	{ code: 'hi', flag: '🇮🇳', name: 'हिन्दी' }
];

function getCurrentLang() {
	const path = window.location.pathname;
	const match = path.match(/^\/(zh|ja|ko|de|es|fr|it|pt|vi|id|th|tr|pl|hi)\//);
	return match ? match[1] : 'en';
}

function getCurrentPage() {
	const path = window.location.pathname;
	// Remove language prefix if present
	const cleanPath = path.replace(/^\/(zh|ja|ko|de|es|fr|it|pt|vi|id|th|tr|pl|hi)\//, '/');
	// Get the page name
	const page = cleanPath.split('/').pop() || 'index.html';
	return page.endsWith('.html') ? page : 'index.html';
}

function buildLangUrl(langCode) {
	const currentPage = getCurrentPage();
	if (langCode === 'en') {
		return currentPage === 'index.html' ? '/' : '/' + currentPage;
	}
	return '/' + langCode + '/' + (currentPage === 'index.html' ? '' : currentPage);
}

function createLangSwitcher() {
	const currentLang = getCurrentLang();
	const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

	const switcher = document.createElement('div');
	switcher.className = 'lang-switcher';
	switcher.innerHTML = `
		<button class="lang-switcher-toggle" aria-label="Select language" aria-haspopup="true" aria-expanded="false">
			<span class="lang-flag">${currentLangData.flag}</span>
			<span class="lang-code">${currentLang.toUpperCase()}</span>
			<i class="bi bi-chevron-down"></i>
		</button>
		<div class="lang-switcher-menu">
			${LANGUAGES.map(lang => `
				<a href="${buildLangUrl(lang.code)}" class="lang-option${lang.code === currentLang ? ' active' : ''}" data-lang="${lang.code}">
					<span class="lang-flag">${lang.flag}</span>
					<span class="lang-name">${lang.name}</span>
				</a>
			`).join('')}
		</div>
	`;

	// Toggle menu
	const toggle = switcher.querySelector('.lang-switcher-toggle');
	toggle.addEventListener('click', (e) => {
		e.stopPropagation();
		switcher.classList.toggle('show');
		toggle.setAttribute('aria-expanded', switcher.classList.contains('show'));
	});

	// Close on outside click
	document.addEventListener('click', (e) => {
		if (!switcher.contains(e.target)) {
			switcher.classList.remove('show');
			toggle.setAttribute('aria-expanded', 'false');
		}
	});

	// Close on Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			switcher.classList.remove('show');
			toggle.setAttribute('aria-expanded', 'false');
		}
	});

	return switcher;
}

function initLangSwitcher() {
	// Find header-auth and insert switcher before it
	const headerAuth = document.querySelector('.header-auth');
	if (headerAuth && !document.querySelector('.lang-switcher')) {
		const switcher = createLangSwitcher();
		headerAuth.parentNode.insertBefore(switcher, headerAuth);
	}
}

document.addEventListener('DOMContentLoaded', initLangSwitcher);

})();
