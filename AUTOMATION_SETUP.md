# Design System Automation Setup

This guide will help you set up automatic synchronization between your design system and your iOS/Android applications.

## 🚀 Quick Start

### 1. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Update the following values in your `.env` file:

```env
# GitHub Integration (Required for automation)
GITHUB_TOKEN=your_github_personal_access_token_here
IOS_REPO=your-org/ios-app
ANDROID_REPO=your-org/android-app

# Figma Webhook (Optional - for automatic Figma sync)
WEBHOOK_SECRET=your_webhook_secret_here

# Slack Notifications (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### 2. GitHub Setup

#### Create a GitHub Personal Access Token:

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Create a new token with these permissions:
   - `repo` (full repository access)
   - `workflow` (to trigger GitHub Actions)
3. Copy the token and add it to your `.env` file

#### Repository Variables:

In your design system repository, add these GitHub repository variables:

- `IOS_REPO`: your-org/ios-app
- `ANDROID_REPO`: your-org/android-app

#### Repository Secrets:

Add these secrets to your design system repository:

- `DESIGN_SYSTEM_TOKEN`: Your GitHub personal access token
- `SLACK_WEBHOOK_URL`: (Optional) Your Slack webhook URL

### 3. iOS App Integration

In your iOS repository, create the following directory structure:

```
YourApp/
├── DesignSystem/
│   ├── DesignSystemLightColors.swift
│   └── DesignSystemDarkColors.swift
```

Add this to your iOS app's main target:

```swift
// Import the design system
import UIKit

// Use design system colors
view.backgroundColor = .solidZ0
label.textColor = .onSurfacePrimary
```

### 4. Android App Integration

In your Android repository, create these files:

```
app/src/main/
├── res/values/
│   └── design_colors.xml
└── java/com/yourapp/designsystem/
    └── DesignSystemColors.kt
```

Use in your Android app:

```kotlin
// XML usage
android:background="@color/solid_z0"
android:textColor="@color/on_surface_primary"

// Compose usage
Surface(color = DesignSystemColors.solidZ0) {
    Text(
        text = "Hello",
        color = DesignSystemColors.onSurfacePrimary
    )
}
```

## 🔄 Automation Workflows

### Automatic Sync (Recommended)

The system automatically syncs tokens when:

1. **Token files change** in the design system repository
2. **Figma webhooks** are received (if configured)
3. **Scheduled intervals** (every 6 hours by default)

### Manual Sync

You can trigger manual sync in several ways:

#### From the UI:

1. Go to `/automation` page
2. Click "Sync Now" button

#### From command line:

```bash
npm run sync:manual
```

#### From GitHub Actions:

1. Go to your repository → Actions
2. Select "Sync Design Tokens" workflow
3. Click "Run workflow"

## 🎯 Figma Integration (Advanced)

### Setup Figma Webhook:

1. **In Token Studio Plugin:**

   - Configure your plugin to push to this repository
   - Set up automatic export on changes

2. **Webhook URL:**

   ```
   https://your-design-system.com/api/automation/webhook/figma
   ```

3. **Webhook Secret:**
   - Generate a random secret string
   - Add it to your `.env` file as `WEBHOOK_SECRET`
   - Configure it in Figma Token Studio settings

### Token Studio Configuration:

```json
{
  "repository": "your-org/design-system",
  "branch": "main",
  "filePath": "tokens",
  "webhookUrl": "https://your-design-system.com/api/automation/webhook/figma",
  "secret": "your_webhook_secret"
}
```

## 📱 Mobile App Setup

### iOS Setup

1. **Add design system files to your Xcode project:**

   ```
   DesignSystem/
   ├── DesignSystemLightColors.swift
   └── DesignSystemDarkColors.swift
   ```

2. **Update your app's Info.plist for dynamic colors:**

   ```xml
   <key>UIUserInterfaceStyle</key>
   <string>Automatic</string>
   ```

3. **Use in your app:**

   ```swift
   // Set colors
   view.backgroundColor = .solidZ0
   label.textColor = .onSurfacePrimary

   // Support dynamic colors
   if traitCollection.userInterfaceStyle == .dark {
       // Dark mode colors are automatically handled
   }
   ```

### Android Setup

1. **Add design system files:**

   ```
   app/src/main/res/values/design_colors.xml
   app/src/main/java/.../DesignSystemColors.kt
   ```

2. **Update your theme:**

   ```xml
   <style name="AppTheme" parent="Theme.Material3.DayNight">
       <item name="android:colorBackground">@color/solid_z0</item>
       <item name="android:textColor">@color/on_surface_primary</item>
   </style>
   ```

3. **Use in Compose:**
   ```kotlin
   @Composable
   fun MyScreen() {
       Surface(color = DesignSystemColors.solidZ0) {
           Text(
               text = "Hello World",
               color = DesignSystemColors.onSurfacePrimary
           )
       }
   }
   ```

## 🔧 Troubleshooting

### Common Issues:

1. **"No GitHub token configured"**

   - Add `GITHUB_TOKEN` to your `.env` file
   - Ensure the token has `repo` permissions

2. **"Repository not found"**

   - Check `IOS_REPO` and `ANDROID_REPO` variables
   - Ensure the GitHub token has access to those repositories

3. **"Webhook verification failed"**

   - Check `WEBHOOK_SECRET` matches between Figma and your env
   - Ensure webhook URL is accessible

4. **"Sync failed"**
   - Check GitHub Actions logs
   - Verify file paths in target repositories exist

### Monitoring:

1. **Check automation status:**

   ```bash
   npm run sync:status
   ```

2. **View logs:**

   - GitHub Actions logs in your repository
   - Server logs: `npm run dev` and check console
   - Automation page: `/automation`

3. **Test manual sync:**
   ```bash
   npm run sync:manual
   ```

## 🚀 Deployment

### Production Setup:

1. **Deploy your design system app:**

   ```bash
   npm run build
   npm start
   ```

2. **Configure webhooks:**

   - Point Figma webhooks to your production URL
   - Update `WEBHOOK_SECRET` in production environment

3. **Set up monitoring:**
   - Configure Slack notifications
   - Monitor GitHub Actions for failed syncs
   - Set up health checks

### Environment Variables in Production:

```env
NODE_ENV=production
GITHUB_TOKEN=prod_github_token
IOS_REPO=your-org/ios-app
ANDROID_REPO=your-org/android-app
WEBHOOK_SECRET=production_webhook_secret
SLACK_WEBHOOK_URL=production_slack_webhook
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Token Studio Documentation](https://docs.tokens.studio/)
- [Figma API Documentation](https://www.figma.com/developers/api)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check the `/automation` page for status
4. Contact the design system team

---

Happy syncing! 🎨✨
