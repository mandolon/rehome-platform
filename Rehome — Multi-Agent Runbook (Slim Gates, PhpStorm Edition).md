# Rehome — Multi-Agent Runbook (Slim Gates, PhpStorm Edition)

## Overview

The Rehome Platform uses a **multi-agent development approach** with specialized AI agents working within defined boundaries and automated CI/CD gates for quality assurance.

## Development Agents

### Cursor (Backend Specialist)
- **Scope**: Backend development, Laravel, PHP, database operations
- **Files**: `backend/**`, backend-related configuration
- **Gates**: Manages Gate B (backend-ci)
- **Constraints**: Cannot modify frontend code or frontend CI workflows

### VS AI (Frontend Specialist)
- **Scope**: Frontend development, Next.js, React, TypeScript
- **Files**: `frontend/**`, `.github/workflows/frontend-ci.yml`, frontend-related docs
- **Gates**: Manages Gate F (frontend-ci) with Storybook integration
- **Constraints**: Cannot modify backend code or backend CI workflows

### Windsurf (Cross-Cutting)
- **Scope**: Cross-cutting concerns, frontend features, documentation
- **Files**: `frontend/**`, documentation, configuration files
- **Gates**: Collaborates on Gate F (frontend-ci)
- **Constraints**: Respects backend ownership boundaries

### Junie (PhpStorm) - **Diagnostic Only**
- **Scope**: Read-only analysis, configuration inspection, diagnostics
- **Tools**: PhpStorm analysis, Storm Guard system
- **Output**: Diagnostic reports, artifact inspection
- **Constraints**: **CANNOT EDIT CODE** - provides diagnostics only

## Global Guardrails

### G2 Tripwire (Warn-Only)
```bash
git status --porcelain=v1
```
- **Purpose**: Alert to uncommitted changes before major operations
- **Mode**: **Warn-only** - will alert but not block operations
- **Implementation**: Called at start of agent operations

### G3 Ownership Boundaries
- Backend agents cannot modify frontend code or workflows
- Frontend agents cannot modify backend code or workflows
- Cross-references must be coordinated through documentation
- **Violation Protocol**: Pause and request appropriate agent intervention

### Junie Constraints
- **Read-Only Role**: Cannot modify any files in the repository
- **Diagnostic Focus**: Provides analysis, configuration review, artifact inspection
- **Output Only**: Generates reports in `frontend/gatef_artifacts_public/`
- **No Gating**: Does not block development workflow - provides insights only

## Slim Gates

### Gate B (Backend CI)
- **Trigger**: Changes to `backend/**` or `backend/` workflow files
- **Owner**: Cursor
- **Workflow**: `.github/workflows/ci.yml` (backend job)
- **Requirements**: 
  - Laravel tests pass
  - PHP syntax validation
  - Composer dependency validation
  - Database migrations run cleanly

### Gate F (Frontend CI)
- **Trigger**: Changes to `frontend/**` or frontend workflow files
- **Owner**: VS AI / Windsurf
- **Workflow**: `.github/workflows/frontend-ci.yml`
- **Requirements**:
  - TypeScript compilation
  - ESLint validation
  - Unit tests pass
  - **Conditional**: Storybook build (only on UI/component changes)

### Storybook Integration
- **Trigger**: UI changes detected in:
  - `frontend/src/**`
  - `frontend/.storybook/**`
  - `frontend/components/**`
  - `frontend/public/**`
  - Configuration files (`*.config.*`, `package.json`)
- **Process**: Automatic Storybook build and artifact generation
- **Artifacts**: Stored in `frontend/gatef_artifacts_public/`

## Agent Workflows

### Cursor Workflow
1. Check G2 Tripwire (warn-only)
2. Verify backend scope
3. Make backend changes
4. Ensure Gate B passes
5. If frontend coupling needed → document requirements for VS AI/Windsurf

### VS AI / Windsurf Workflow
1. Check G2 Tripwire (warn-only)
2. Verify frontend scope
3. Make frontend changes
4. Ensure Gate F passes (including Storybook if UI changes)
5. If backend coupling needed → document requirements for Cursor

### Junie Workflow (Diagnostic Only)
1. Run Storm Guard diagnostics
2. Generate read-only analysis reports
3. Inspect configurations and artifacts
4. Output findings to public artifacts directory
5. **No code modifications** - analysis only

## Storm Guard System

### Read-Only Mode (Default)
```powershell
# Via VS Code Task
"Storm: Proof (Read-Only)"

# Or manually
.\scripts\Storm-Guard.ps1
```

### Write-Enabled Mode (One-Run)
```powershell
# Via VS Code Task
"Storm: Enable Writes (One-Run)"

# Or manually with environment variable
$env:STORM_ALLOW_WRITE="1"; .\scripts\Storm-Guard.ps1
```

### Outputs
- **Console**: Real-time diagnostic information
- **Public Artifacts**: `frontend/gatef_artifacts_public/TIMESTAMP/`
- **Debug Artifacts**: `frontend/.gatef_artifacts/` (local debugging only)

## Conflict Resolution

### Ownership Violations
1. **Detection**: Agent attempts to modify files outside scope
2. **Response**: Pause operation, document required changes
3. **Resolution**: Request appropriate agent to make changes
4. **Communication**: Use PR comments or issue tracking

### CI Failures
1. **Gate B Failure**: Cursor investigates backend issues
2. **Gate F Failure**: VS AI/Windsurf investigates frontend issues
3. **Cross-Domain Issues**: Coordinate through documentation

### Integration Issues
1. **Backend API Changes**: Cursor documents changes, VS AI/Windsurf adapts frontend
2. **Frontend Requirements**: VS AI/Windsurf documents needs, Cursor implements backend support
3. **Configuration Changes**: Coordinate through shared documentation

## Best Practices

### For All Agents
- Always run G2 Tripwire at start of major operations
- Respect ownership boundaries strictly
- Document cross-domain requirements clearly
- Ensure relevant CI gates pass before completion

### For Junie (Diagnostic Agent)
- Focus on analysis and inspection only
- Generate comprehensive diagnostic reports
- Identify configuration issues and potential optimizations
- Provide insights without code modifications

### Gate Discipline
- **Gate B**: Must pass for backend PRs
- **Gate F**: Must pass for frontend PRs, includes Storybook on UI changes
- **No Gate Bypassing**: All changes must pass appropriate gates
- **Cross-Domain**: Use documentation to coordinate between domains

## Emergency Procedures

### CI System Down
1. Document all changes made during outage
2. Run local equivalents of gate checks
3. When CI restored, verify all changes pass gates
4. Create catch-up PRs if necessary

### Agent Boundary Violations
1. **Immediate**: Stop the violating operation
2. **Assess**: Determine what changes need to be made
3. **Coordinate**: Request appropriate agent to make changes
4. **Document**: Record the boundary violation for future reference

### Integration Failures
1. **Identify**: Which domain (backend/frontend) needs changes
2. **Coordinate**: Through documentation and clear requirements
3. **Implement**: Let appropriate agent make necessary changes
4. **Verify**: Ensure all gates pass after resolution

## Monitoring & Metrics

### Gate Success Rates
- Track Gate B and Gate F pass rates
- Identify common failure patterns
- Optimize gate requirements based on data

### Agent Efficiency
- Monitor agent task completion times
- Track boundary violation incidents
- Measure cross-domain coordination effectiveness

### Diagnostic Insights (Junie)
- Track configuration drift
- Monitor artifact generation patterns
- Identify optimization opportunities

---

**Remember**: Junie is diagnostic-only and does not gate development workflow. All code changes must respect agent ownership boundaries and pass appropriate CI gates.