function isChecked(checkboxId) {
    return $(checkboxId)[0].checked;
}

const regexes = {
    vitEmailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((vitstudent.ac.in)|(vit.ac.in))$/,
    emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    mobileRegex: /^[6-9]\d{8,9}$/, // 9-10 characters
    passwordRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{8,16}$/, // 8-16 characters,
    regNoRegex: /^\d\d[A-Z]{3}[0-9]{4}$/,
    usernameRegex: /^[a-zA-Z0-9`!@#$%^&*()-/:'.,{}_"~]{3,20}$/,
};


class InputField {
    constructor(name, regex, message) {
        this.name = name;
        this.element = $(`input[name="${name}"]`);
        this.regex = regex;
        this.message = message;
        this.errorElem = $(`<div class="input-group-append" data-container="form" data-toggle="popover" data-placement="right" data-content="${this.message}">
                                <div class="input-group-text"><i class="fas fa-exclamation-circle"></i></div>
                            </div>`);
        $('body').append(this.popperElem);
        this.element.after(this.errorElem);

        this.errorElem.popover({
            container: 'form',
            trigger: 'hover',
        });

        this.errorElem.hide();
        this.element.on('input', () => {
            this.validate();
        });
    }

    validate() {
        if (this.name === 'email') {
            if (isChecked($('#lg_vitian'))) {
                this.regex = regexes.vitEmailRegex;
            } else {
                this.regex = regexes.emailRegex;
            }
        } else if (this.name === 'regNo') {
            if (!isChecked($('#lg_vitian'))) {
                return true;
            }
        }
        if (!this.regex.test(this.element.val())) {
            this.errorElem.show();
            return false;
        }
        this.errorElem.hide();
        return true;
    }
}

$(() => {
    const fields = [{
        name: 'email',
        regex: regexes.emailRegex,
        message: 'Invalid Email.',
    }, {
        name: 'mobile',
        regex: regexes.mobileRegex,
        message: 'Invalid Mobile.',
    }, {
        name: 'password',
        regex: regexes.passwordRegex,
        message: 'Invalid Password. Password must have 8-16 characters.',
    }, {
        name: 'regNo',
        regex: regexes.regNoRegex,
        message: 'Invalid Registration Number.',
    }, {
        name: 'username',
        regex: regexes.usernameRegex,
        message: 'Invalid Username. Username should contain atleast 3 characters.',
    }];
    const fieldObjs = {};
    fields.forEach((field) => {
        fieldObjs[field.name] = new InputField(field.name, field.regex, field.message);
    });

    $('#login-form').submit(() => {
        const keys = Object.keys(fieldObjs);
        for (let i = 0; i < keys.length; i += 1) {
            if (!fieldObjs[keys[i]].validate()) {
                $('.submit-failure').show();
                return false;
            }
        }
        return true;
    });

    $('#lg_vitian').change((event) => {
        fieldObjs.email.validate();
        if (isChecked(event.currentTarget)) {
            $('.hide-group').slideDown();
            $('#lg_email').fadeOut(() => {
                $('#lg_email').attr('placeholder', 'VIT Email-ID');
                $('#lg_email').fadeIn();
            });
            $('#lg_regno').attr('required', true);
        } else {
            $('#lg_email').fadeOut(() => {
                $('#lg_email').attr('placeholder', 'Email-ID');
                $('#lg_email').fadeIn();
            });
            $('.hide-group').slideUp();
            $('#lg_regno').removeAttr('required');
        }
    });
});
