import type { ILink } from '@mongo/models/link.js';

export interface ILinkInterface {
  createLink(linkProps: Partial<ILink>): Promise<ILink>;
  updateLink(linkProps: Partial<ILink>): Promise<ILink>;
}