"use strict";

function readUserCodeFromUrl(url) {
  const parsedUrl = new URL(url, "http://localhost");
  return parsedUrl.searchParams.get("code");
}

function runSnippet(url) {
  const userSuppliedCode = readUserCodeFromUrl(url);

  if (!userSuppliedCode) {
    return "nothing to run";
  }

  // Intentionally unsafe: this exists so the CodeQL example has something to flag.
  return eval(userSuppliedCode);
}

console.log(runSnippet("http://localhost/?code=2%20%2B%202"));
