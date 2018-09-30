declare namespace sizeSensor {
    export const bind: (
        element: HTMLElement | null,
        cb: (element: HTMLElement | null) => void
    ) => () => void;
    export const clear: (element: HTMLElement | null) => void;
}
export = sizeSensor;
