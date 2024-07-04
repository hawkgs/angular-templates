/**
 * Keeps track of abort controllers for running requests.
 * Use in API services.
 *
 * @returns Abort function that returns an AbortSignal
 */
export function fetchAbort(): (n: string) => AbortSignal {
  const abortCtrls = new Map<string, AbortController>();

  return (apiName: string) => {
    let ctrl = abortCtrls.get(apiName);
    if (ctrl) {
      ctrl.abort();
    }

    ctrl = new AbortController();
    abortCtrls.set(apiName, ctrl);

    return ctrl.signal;
  };
}
