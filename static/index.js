const DICE_TYPES = [4, 6, 8, 10, 12, 20];

var total = 0;

// Get the numeric input value
function getInputValue(diceType) {
  const val = $(`#numD${diceType}`).val();
  return val ? parseInt(val, 10) : 0;
}

// Disable minus button if input <= 0
function updateMinusButtonState(diceType) {
  const v = getInputValue(diceType);
  $(`#minusD${diceType}`).prop("disabled", v <= 0);
}

$(document).ready(function () {
  // Hook up the minus and plus buttons with the inputs
  for (const n of DICE_TYPES) {
    // Set initial button state
    updateMinusButtonState(n);

    $(`#plusD${n}`).click(function () {
      const v = getInputValue(n);
      $(`#numD${n}`).val(v + 1);
      updateMinusButtonState(n);
    });

    $(`#minusD${n}`).click(function () {
      const v = getInputValue(n);
      if (v > 0) {
        $(`#numD${n}`).val(v - 1);
      }
      updateMinusButtonState(n);
    });

    $(`#numD${n}`).on("input", function () {
      updateMinusButtonState(n);
    });
  }

  // Submit and clear buttons
  $(`#rollBtn`).click(function () {
    total = 0;

    const trng = $(`#trngSwitch`).is(":checked");

    for (const n of DICE_TYPES) {
      $(`#outputD${n}`).html("");

      const v = getInputValue(n);
      if (v <= 0) {
        continue;
      }

      $.ajax({
        url: "r",
        data: {
          num: v,
          max: n,
          trng: trng,
        },
        success: function (result) {
          $(`#outputD${n}`).html(result.join(" + ")).css("color", "black");
          total += result.reduce((sum, n) => sum + n, 0);
        },
        error: function (xhr) {
          $(`#outputD${n}`).html(xhr.responseJSON.error).css("color", "red");
        },
      });
    }
  });

  $(`#spinner`).hide();

  $(document).ajaxStart(function () {
    $(`#outputTotal`).html("");
    $(`#spinner`).show();
  });

  $(document).ajaxStop(function () {
    $(`#spinner`).hide();
    $(`#outputTotal`).html(total);
  });

  $(`#clearBtn`).click(function () {
    for (const n of DICE_TYPES) {
      $(`#numD${n}`).val("");
      updateMinusButtonState(n);
      $(`#outputD${n}`).html("");
      $(`#outputTotal`).html("");
    }
    $(`#trngSwitch`).prop("checked", false);
  });

  // TODO: Make dice icons clickable
});
