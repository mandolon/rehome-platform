# RBAC Flag Removal - Cursor Prompt

```txt
from: cursor
Next: Complete RBAC flag removal and legacy cleanup after PR #27 merges.

Steps:
1) git fetch --all --prune
2) git checkout chore/rbac-flag-removal
3) git merge main (to get latest changes from PR #27)

4) Remove SIMPLE_RBAC flag usage:
   - Search for all SIMPLE_RBAC references in codebase
   - Remove conditional code paths (keep only SIMPLE_RBAC=1 behavior)
   - Update .env files and documentation

5) Collapse CI matrix:
   - Update .github/workflows/ci.yml to single PHPUnit run
   - Remove --group simple_rbac and --exclude-group simple_rbac
   - Keep only SIMPLE_RBAC=1 test execution

6) Drop legacy namespace:
   - Remove app/Legacy/RequestPolicy.php
   - Remove tests/Legacy/ directory
   - Update any remaining references to Legacy namespace

7) Add DB migration:
   - Create migration to drop deprecated per-request role columns
   - Include: request_role, request_permissions, etc.
   - Add rollback functionality

8) Update test configuration:
   - Remove @group simple_rbac and @group legacy annotations
   - Clean up phpunit.xml configuration
   - Ensure all tests run in single suite

9) Run full test suite:
   - vendor/bin/phpunit --testsuite Unit,Feature
   - Verify all tests pass
   - Check for any remaining SIMPLE_RBAC references

10) Commit changes:
    - git add .
    - git commit -m "Remove SIMPLE_RBAC flag; drop legacy RBAC code and DB columns"
    - git push origin chore/rbac-flag-removal

11) gh pr create \
  --title "RBAC Flag Removal: eliminate SIMPLE_RBAC; drop legacy code and DB columns" \
  --body "Removed SIMPLE_RBAC flag and all conditional code paths. Collapsed CI to single run. Dropped Legacy namespace and RequestPolicy. Added migration to remove deprecated per-request role columns. All tests updated and passing."

12) Post verification checklist:
   - [ ] CI green (single run, no matrix)
   - [ ] No SIMPLE_RBAC references in codebase
   - [ ] Legacy namespace completely removed
   - [ ] DB migration ready for deployment
   - [ ] All tests passing without groups
   - [ ] Documentation updated

Definition of Done: PR open, CI green, legacy code removed, DB migration added, tests passing.
```

## Key Changes Expected:

### Code Changes:
- Remove all `if (env('SIMPLE_RBAC'))` conditionals
- Keep only the "simple" RBAC behavior (area-based auth)
- Remove `app/Legacy/RequestPolicy.php`
- Remove `tests/Legacy/` directory

### CI Changes:
- Single PHPUnit run instead of matrix
- Remove `--group simple_rbac` and `--exclude-group simple_rbac`
- Keep only `SIMPLE_RBAC=1` environment

### Database Changes:
- Migration to drop columns like `request_role`, `request_permissions`
- Include proper rollback functionality

### Test Changes:
- Remove `@group simple_rbac` and `@group legacy` annotations
- All tests run in unified suite
- No conditional test execution

This completes the RBAC modernization by removing the transitional flag and legacy code.
