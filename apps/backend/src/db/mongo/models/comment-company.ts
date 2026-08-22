import {model, type Model, Schema} from "mongoose";

export interface iCommentCompany extends Document {

}

const commentCompanySchema = new Schema<iCommentCompany>({})

export const CompanyCommend: Model<iCommentCompany> = model<iCommentCompany>(
    "CommentCompany",
    commentCompanySchema,
);