function isChecked(checkboxId) {
    return $(checkboxId)[0].checked;
}

$('#lg_vitian').change(() => {
    if (isChecked('#lg_vitian')) {
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
