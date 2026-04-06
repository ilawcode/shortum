# ShortcutHub Engine (iOS) Algorithm

1. Receive Input (Shortcut ID)
2. URL = "https://shortcuthub.com/api/s/" + Input
3. Get Contents of URL (JSON)
4. For Each Item in JSON['actions']:
   - If Type == 'is.workflow.actions.gettext':
     - Set Variable [Text_Result] to Item['params']['text']
   - If Type == 'is.workflow.actions.speaktext':
     - Speak [Text_Result]
   - (Validation: If Type not in Whitelist -> Exit & Alert)