import type { ILinkInterface } from "@interface/link-interface.js";
import type { IMailerService } from "@interface/mail-service.js";
import type { ILink } from "@mongo/models/link.js";
import { Link } from "@mongo/models/link.js";
import { BaseService } from "@services/Base-Service.js";

export class LinkService extends BaseService implements ILinkInterface {
  private mailerService: IMailerService;

  constructor(mailerService: IMailerService) {
    super();
    this.mailerService = mailerService;
  }

  async createLink(linkProps: Partial<ILink>): Promise<ILink> {
    const link = new Link(linkProps);
    await link.save();
    return link;
  }

  async updateLink(linkProps: Partial<ILink>): Promise<ILink> {
    const link = await Link.findById(linkProps);
    if (!link) throw new Error("User not found");
    Object.assign(link, linkProps);
    await link.save();
    return link;
  }
}
