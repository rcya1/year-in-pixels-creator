export let handleError = function (err, addAlert, specialErrors) {
  if (err.response !== undefined) {
    let response = err.response.data;
    if (specialErrors !== undefined) {
      for (let error of specialErrors) {
        if (response.includes(error[0])) {
          addAlert("danger", error[1], error.length === 2 ? "" : error[2]);
          return;
        }
      }
    }
    addAlert("danger", "Unknown Error", response);
  } else {
    addAlert("danger", "Unknown Error", err.toString());
  }
};
