/**
 * Flyto2 Shared Authentication Module
 * Include this file on all pages that need authentication
 */

// Firebase Configuration
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
	<div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
			<div class="modal-content auth-modal-content">
				<button type="button" class="btn-close auth-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>

				<!-- Logo -->
				<div class="auth-modal-logo">
					<img src="assets/img/logo.png" alt="Flyto2" style="height: 40px;">
				</div>

				<!-- Tab Switcher -->
				<div class="auth-tabs">
					<button class="auth-tab active" id="tabLogin">Sign In</button>
					<button class="auth-tab" id="tabRegister">Sign Up</button>
				</div>

				<div class="auth-modal-body">
					<!-- Login Form -->
					<div id="loginForm">
						<div class="auth-input-group">
							<label class="auth-label">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope"></i>
								<input type="email" class="auth-input" id="authEmail" placeholder="your@email.com" required>
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label">Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock"></i>
								<input type="password" class="auth-input" id="authPassword" placeholder="Enter password" required>
							</div>
						</div>
						<div class="auth-forgot">
							<a href="#" id="showForgotPassword">Forgot password?</a>
						</div>
						<div id="authError" class="auth-error d-none"></div>
						<button class="auth-btn" id="btnLogin">
							<span id="loginBtnText">Sign In</span>
							<span id="loginBtnSpinner" class="spinner-border spinner-border-sm d-none ms-2"></span>
						</button>
					</div>

					<!-- Register Form -->
					<div id="registerForm" class="d-none">
						<div class="auth-input-group">
							<label class="auth-label">Username</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-person"></i>
								<input type="text" class="auth-input" id="registerUsername" placeholder="Your display name" required>
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope"></i>
								<input type="email" class="auth-input" id="registerEmail" placeholder="your@email.com" required>
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label">Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock"></i>
								<input type="password" class="auth-input" id="registerPassword" placeholder="At least 6 characters" required>
							</div>
						</div>
						<div class="auth-input-group">
							<label class="auth-label">Confirm Password</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-lock-fill"></i>
								<input type="password" class="auth-input" id="registerPasswordConfirm" placeholder="Confirm password" required>
							</div>
						</div>
						<div id="registerError" class="auth-error d-none"></div>
						<button class="auth-btn" id="btnRegister">
							<span id="registerBtnText">Create Account</span>
							<span id="registerBtnSpinner" class="spinner-border spinner-border-sm d-none ms-2"></span>
						</button>
						<p class="auth-terms">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
					</div>

					<!-- Forgot Password Form -->
					<div id="forgotPasswordForm" class="d-none">
						<div class="auth-back">
							<a href="#" id="backToLogin"><i class="bi bi-arrow-left"></i> Back to sign in</a>
						</div>
						<h5 class="auth-subtitle">Reset Password</h5>
						<p class="auth-desc">Enter your email and we'll send you a reset link.</p>
						<div class="auth-input-group">
							<label class="auth-label">Email</label>
							<div class="auth-input-wrapper">
								<i class="bi bi-envelope"></i>
								<input type="email" class="auth-input" id="forgotEmail" placeholder="your@email.com" required>
							</div>
						</div>
						<div id="forgotError" class="auth-error d-none"></div>
						<div id="forgotSuccess" class="auth-success d-none"></div>
						<button class="auth-btn" id="btnForgot">Send Reset Link</button>
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

/**
 * Show auth modal
 */
function showAuthModal() {
	const modal = new bootstrap.Modal(document.getElementById('authModal'));
	modal.show();
}

/**
 * Hide auth modal
 */
function hideAuthModal() {
	const modalEl = document.getElementById('authModal');
	const modal = bootstrap.Modal.getInstance(modalEl);
	if (modal) modal.hide();
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
 * Login Handler
 */
async function handleLogin() {
	const email = document.getElementById('authEmail').value.trim();
	const password = document.getElementById('authPassword').value;
	const btn = document.getElementById('btnLogin');
	const btnText = document.getElementById('loginBtnText');
	const spinner = document.getElementById('loginBtnSpinner');

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
		hideAuthModal();
	} catch (error) {
		let message = 'Login failed. Please try again.';
		if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
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
		document.getElementById('forgotSuccess').textContent = 'Reset link sent! Check your email.';
		document.getElementById('forgotSuccess').classList.remove('d-none');
	} catch (error) {
		let message = 'Failed to send reset email.';
		if (error.code === 'auth/user-not-found') {
			message = 'No account found with this email';
		} else if (error.code === 'auth/invalid-email') {
			message = 'Please enter a valid email address';
		}
		showError('forgotError', message);
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

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export for global access
window.FlytoAuth = {
	getCurrentUser,
	isLoggedIn,
	getIdToken,
	showAuthModal,
	hideAuthModal,
	handleSignOut,
	FIREBASE_URL
};
