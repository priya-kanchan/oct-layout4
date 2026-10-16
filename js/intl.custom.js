$(document).ready(function () {
  $(".phone-input").each(function () {
    const input = this;
    const output = $(this).siblings(".output");

    const iti = window.intlTelInput(input, {
      allowDropdown: true,
      separateDialCode: true,
      initialCountry: "In",
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
    });

    const updateCountryCode = () => {
      const countryData = iti.getSelectedCountryData();
      const dialCode =
        countryData && countryData.dialCode
          ? "+" + countryData.dialCode
          : "+91";

      // 1. By data-countrycode-id attribute
      const targetId = $(input).data("countrycode-id");
      if (targetId && $("#" + targetId).length) {
        $("#" + targetId).val(dialCode);
      }

      // 2. By hidden input within parent container
      const hiddenInParent = $(input)
        .closest(".mb-3, .form-floating, .col-sm-12, .banner-form-section, div")
        .find(
          'input[type="hidden"][id^="qCountryCode"], input[type="hidden"][name^="qCountryCode"]',
        );
      if (hiddenInParent.length) {
        hiddenInParent.val(dialCode);
      }

      // 3. By matching ID pattern
      const inputId = $(input).attr("id");
      if (inputId) {
        const fallbackId = inputId.replace("phone_contact", "qCountryCode");
        if ($("#" + fallbackId).length) {
          // $('#' + fallbackId).val(dialCode);
        }
      }
    };

    // Set initial country code on initialization
    updateCountryCode();

    const handleChange = () => {
      let text;
      if (input.value) {
        text = iti.isValidNumber()
          ? "Valid number! Full international format: " + iti.getNumber()
          : "Invalid number - please try again";
      } else {
        text = "Please enter a valid number";
      }
      output.empty().text(text);
      updateCountryCode();
    };

    // Listen for country selection change and typing
    $(input).on("change keyup blur countrychange", handleChange);
    input.addEventListener("countrychange", updateCountryCode);
  });
});