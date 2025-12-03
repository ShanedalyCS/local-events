// Allow importing plain JS/JSX modules from TS without type declarations
declare module '*.js' {
  const value: any;
  export default value;
}

declare module '*.jsx' {
  const value: any;
  export default value;
}
