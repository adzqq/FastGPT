import { ConfigTagSchemaType } from '@fastgpt/global/core/config/type.d';
import { connectionMongo, type Model } from '../../common/mongo';
const { Schema, model, models } = connectionMongo;
export const ConfigTagName = 'datasets';

const ConfigTagSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});
export const MongoConfigTag: Model<ConfigTagSchemaType> =
  models[ConfigTagName] || model(ConfigTagName, ConfigTagSchema);
MongoConfigTag.syncIndexes();
