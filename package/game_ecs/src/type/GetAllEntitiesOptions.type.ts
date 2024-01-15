import { ComponentKeyType } from "./ComponentKey.type";

export type GetAllEntitiesOptions = {
  deletedEquals?: boolean;
  mountedEquals?: boolean;
  activeEquals?: boolean;
  hasComponents?: ComponentKeyType[]
}
