export interface Trip {
  id: string;
  location: string[];
  from: Date;
  to: Date;
  createdAt: Date;
  updatedAt: Date;
  deleteFlag: boolean;
  members: string[];
}

export class TripDao implements IDao<Trip> {
  create(data: Trip): Trip {
    throw new Error('Method not implemented.');
  }
  read(id: string): Trip {
    throw new Error('Method not implemented.');
  }
  list(data: Trip): Trip[] {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: Trip): Trip {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Trip {
    throw new Error('Method not implemented.');
  }
}
