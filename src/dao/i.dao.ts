interface IDao<T> {
  create: (data: T) => T;
  read: (id: string) => T;
  list: (data: T) => T[];
  update: (id: string, data: T) => T;
  delete: (id: string) => T;
}
