export type NoId<T> = Omit<T, 'id'>;

export type NullToOptional<T> = {
    [K in keyof T as null extends T[K] ? never : K]: T[K]
  } & {
    [K in keyof T as null extends T[K] ? K : never]?: T[K]
  };

export type MakeOptional<T> = {
    [K in keyof T]?: T[K];
  };
  