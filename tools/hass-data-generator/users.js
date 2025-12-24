// Home Assistant user IDs
// To find user IDs: ssh root@homeassistant.local "ha core exec -c 'cat /config/.storage/auth'" | grep -A2 '"name"'
// Or via UI: Settings > People > click user > look at URL for the ID

export const USERS = {
  sharon: 'bdc857a611d74e9998fdc8535024b263',
  shahar: 'b10953f68ec043cea57260ca2f5e0880',
  tom: '42aa497a257c46f9a1c8650a32a46e57',
}

// Pre-defined groups for convenience
export const ADULTS = [USERS.sharon, USERS.shahar]
export const ALL = Object.values(USERS)

