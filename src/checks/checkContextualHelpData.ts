// a simple check that contextual help data json respects type definition

import * as fs from "fs";
import { ContextualHelp } from "../../generated/definitions/content/ContextualHelp";
import { getDuplicates } from "../utils/collections";
import * as jsonValidator from "json-dup-key-validator";

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

const contextualHelpData = ContextualHelp.decode(
  jsonValidator.parse(
    fs.readFileSync(__dirname + "/../../contextualhelp/data.json").toString(),
    false
  )
);
if (!contextualHelpData.isRight()) {
  error("contextualhelp/data.json is not compatible with ContextualHelp type");
} else {
  // check for duplicates
  const itScreens = getDuplicates(
    contextualHelpData.value.it.screens,
    (a, b) => a.route_name === b.route_name
  );
  const enScreens = getDuplicates(
    contextualHelpData.value.en.screens,
    (a, b) => a.route_name === b.route_name
  );
  if (itScreens.length + enScreens.length > 0) {
    error(
      `these screens are repeated more than one time :\n${[
        ...itScreens,
        ...enScreens
      ]
        .map(d => d.route_name)
        .join("\n")}`
    );
  }
}

process.exit(0);
