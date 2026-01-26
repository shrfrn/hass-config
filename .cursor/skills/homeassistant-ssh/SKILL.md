---
name: homeassistant-ssh
description: SSH access to Home Assistant Raspberry Pi device. Use when needing to access the Pi, deploy configurations, run commands on the device, or when the user mentions SSH, Pi access, or homeassistant.local.
---

# Home Assistant SSH Access

## Connection Details

SSH to the Home Assistant Pi using:

```bash
ssh root@homeassistant.local
```

**No password required** - authentication is configured via SSH keys.

## Usage

When the user needs to:
- Access the Home Assistant Pi
- Deploy configurations
- Run commands on the device
- Check system status
- Modify files on the Pi

Use the SSH command above. The connection is passwordless and uses root access.
