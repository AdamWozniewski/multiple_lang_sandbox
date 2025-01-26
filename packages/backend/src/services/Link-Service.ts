import type { ILinkInterface } from '@interface/link-interface.js';
import { Link } from '@mongo/models/link.js';
import type { ILink } from '@mongo/models/link.js';

export class LinkService implements ILinkInterface{
  async createLink(linkProps: Partial<ILink>): Promise<ILink> {
    console.log(linkProps);
    const link = new Link(linkProps);

    return await link.save();
  }

  async updateLink(linkProps: Partial<ILink>): Promise<ILink> {
    const link = await Link.findById(linkProps);
    if (!link) throw new Error("User not found");
    Object.assign(link, linkProps);
    await link.save();
    return link;
  }
}