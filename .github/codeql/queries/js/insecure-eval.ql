/**
 * @name Direct eval in demo code
 * @description Minimal custom query to show how CodeQL can flag risky patterns.
 * @kind problem
 * @problem.severity warning
 * @id local/js/direct-eval-demo
 * @tags security
 *       maintainability
 */

import javascript

from CallExpr call, Identifier callee
where
  call.getCallee() = callee and
  callee.getName() = "eval"
select call, "This demo calls eval() directly. CodeQL reports it through a custom query."
