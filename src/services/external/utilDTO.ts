export type Mask<Type> = {
  [Property in keyof Type]: string;
};
