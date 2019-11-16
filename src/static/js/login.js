// eslint-disable-next-line no-unused-vars
function replaceForm() {
    const passwordResetForm = `<form id="login-form" class="login-form-1" method="POST" action="/forgotPassword" onsubmit="notify()">

                                    <div class="input-group py-1">
                                        <label for="lg_email" class="sr-only">Email</label>
                                        <input type="text" class="form-control" id="lg_email" name="email"
                                            placeholder="Email" maxlength="190" required>
                                    </div>

                                    <div class="submit-button-container text-center mt-4">
                                        <input type="submit" class="btn mt-2 submit-button px-4" value="SUBMIT"/>
                                    </div>

                                    <div class="text-center form-message mt-3">
                                        Haven't been here before? <a href="/auth/register">Sign up</a>.
                                    </div>
                                </form>`;

    const cardTitle = '<div class="card-title"><strong>FORGOT PASSWORD</strong></div>';
    $('.card-title').replaceWith(cardTitle);
    $('#login-form').replaceWith(passwordResetForm);
}

// eslint-disable-next-line no-unused-vars
function notify() {
    const email = $('#lg_email').val();
    const message = `<div class="text-center form-message mt-3">
                        We have emailed password-reset instructions to<br>
                        <a href="mailto:${email}" style="color: #0381ff; font-size: 2rem;">${email}</a>.<br><br>
                        Need help? <a href="mailto:askcsivit@gmail.com">Contact us</a>.
                    </div>`;

    const cardTitle = '<div class="card-title"><strong>CHECK YOUR EMAIL</strong></div>';

    $('.card-title').replaceWith(cardTitle);
    $('.card-body').replaceWith(message);
}
