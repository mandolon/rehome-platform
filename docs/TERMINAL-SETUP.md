# VS Code Terminal Shell Integration

This workspace is configured with VS Code Terminal Shell Integration enabled for consistent development experience across different platforms.

## Prerequisites

### Windows
- PowerShell execution policy set to `RemoteSigned` for the current user
- This allows VS Code to inject shell integration code safely

### Setup Commands
If you're setting up a new development environment:

```powershell
# Windows PowerShell setup
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```

## Configuration
The workspace includes terminal shell integration settings in `.vscode/settings.json`:
- Shell integration enabled
- Default profiles per OS (PowerShell on Windows, bash on Linux, zsh on macOS)
- Persistent terminal working directory
- Enhanced file link detection

## Verification
After setup, you should see command decorations and enhanced history in VS Code integrated terminals.