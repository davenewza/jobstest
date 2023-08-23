import { ImportEmails, models } from "@teamkeel/sdk";
import { error } from "console";

export default ImportEmails(async (ctx, inputs) => {
  // expects inputs to be a json string which is an array of emails
  const data: string[] = JSON.parse(inputs.data);

  if (!Array.isArray(data)) {
    throw new error("data is not an array. Must be a json array of emails");
  }

  const promises = data.map(async (email) => {
    const existing = await models.users.findOne({ email });

    if (!existing) {
      await models.users.create({
        email,
        active: inputs.active,
      });
      console.log("added ", email);
    } else {
      console.log(email, " already exists - skipping");
    }
  });

  const results = await Promise.all(promises);

  console.log("processed ", data.length, " emails");
});