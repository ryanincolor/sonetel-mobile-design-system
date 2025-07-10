# Button Component Specification

**Target Platforms**: iOS and Android native apps only  
**Design Source**: Figma Design System  
**Token Integration**: Uses generated design tokens from Style Dictionary

## Component Overview

The Button component is a fundamental interactive element in the Sonetel mobile design system. It provides consistent styling, behavior, and accessibility across iOS and Android platforms.

## Design Specifications

### Base Properties

- **Typography**: font.family.mobile (Inter font family)
- **Font Weight**: font.weight.bold (semi-bold/600)
- **Shape**: Fully rounded corners (height/2 radius for pill shape)
- **Touch Target**: Minimum 44pt (iOS) / 48dp (Android)
- **Animation**: Scale down to 98% on press
- **Accessibility**: Supports screen readers and high contrast modes

### Size Variants

| Size | Height  | Padding (H×V)         | Font Size    | Min Width | Use Case              |
| ---- | ------- | --------------------- | ------------ | --------- | --------------------- |
| XS   | 32pt/dp | spacing.04×spacing.02 | font.size.xs | -         | Compact spaces        |
| SM   | 40pt/dp | spacing.05×spacing.03 | font.size.sm | -         | Secondary actions     |
| MD   | 36pt/dp | spacing.05×spacing.03 | font.size.sm | 72pt/dp   | Standard buttons      |
| LG   | 56pt/dp | spacing.07×spacing.05 | font.size.lg | -         | Primary actions       |
| XL   | 56pt/dp | spacing.06×spacing.05 | font.size.lg | 280pt/dp  | Hero/featured buttons |

### Style Variants

| Variant     | Background Token | Text Token | Border | Usage                  |
| ----------- | ---------------- | ---------- | ------ | ---------------------- |
| Primary     | `solid.z7`       | `solid.z0` | None   | Main actions           |
| Secondary   | `solid.z1`       | `solid.z7` | None   | Secondary actions      |
| Outline     | `transparent.t1` | `solid.z7` | 2pt/dp | Alternative actions    |
| Ghost       | `transparent`    | `solid.z7` | None   | Minimal actions        |
| Destructive | `alert.critical` | `solid.z0` | None   | Dangerous actions      |
| Success     | `accents.green`  | `solid.z0` | None   | Positive confirmations |

### States

- **Default**: Normal appearance
- **Pressed**: 98% scale, darker background (10% overlay)
- **Disabled**: 50% opacity, no interaction
- **Loading**: Show spinner, disable interaction, maintain size
- **Focus**: Accessibility outline (platform standard)

## Figma Reference Implementation

### X-Large Primary Button (Featured)

```
Properties:
- Transparent: False
- Emphasis: Primary
- Type: Label
- Size: X-large
- State: Enabled

Specifications:
- Width: min 280pt/dp
- Height: 56pt/dp
- Padding: 20×16pt/dp
- Border Radius: 36pt/dp (fully rounded)
- Background: #0A0A0A (solid.z7 token)
- Text: #FFFFFF (solid.z0 token)
- Font: Inter, 18pt/sp, SemiBold (600)
- Letter Spacing: -0.36pt/sp
- Line Height: 20pt/sp
```

## iOS Implementation Guide

### UIKit Implementation

```swift
import UIKit

@IBDesignable
class SonetelButton: UIControl {

    // MARK: - Public Properties

    @IBInspectable var title: String = "" {
        didSet { updateTitle() }
    }

    var size: ButtonSize = .medium {
        didSet { updateAppearance() }
    }

    var variant: ButtonVariant = .primary {
        didSet { updateAppearance() }
    }

    var isLoading: Bool = false {
        didSet { updateLoadingState() }
    }

    // MARK: - Private Properties

    private let titleLabel = UILabel()
    private let loadingIndicator = UIActivityIndicatorView(style: .medium)
    private var heightConstraint: NSLayoutConstraint?
    private var widthConstraint: NSLayoutConstraint?

    // MARK: - Initialization

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupButton()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }

    // MARK: - Setup

    private func setupButton() {
        setupTitleLabel()
        setupLoadingIndicator()
        setupConstraints()
        updateAppearance()

        addTarget(self, action: #selector(touchDown), for: .touchDown)
        addTarget(self, action: #selector(touchUp), for: [.touchUpInside, .touchUpOutside, .touchCancel])
    }

    private func setupTitleLabel() {
        titleLabel.textAlignment = .center
        titleLabel.numberOfLines = 1
        titleLabel.adjustsFontForContentSizeCategory = true
        addSubview(titleLabel)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
    }

    private func setupLoadingIndicator() {
        loadingIndicator.hidesWhenStopped = true
        addSubview(loadingIndicator)
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
    }

    private func setupConstraints() {
        NSLayoutConstraint.activate([
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: centerYAnchor),
            titleLabel.leadingAnchor.constraint(greaterThanOrEqualTo: leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor, constant: -16),

            loadingIndicator.centerXAnchor.constraint(equalTo: centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: centerYAnchor)
        ])
    }

    // MARK: - Updates

    private func updateAppearance() {
        // Apply size constraints
        heightConstraint?.isActive = false
        heightConstraint = heightAnchor.constraint(equalToConstant: size.height)
        heightConstraint?.isActive = true

        if let minWidth = size.minWidth {
            widthConstraint?.isActive = false
            widthConstraint = widthAnchor.constraint(greaterThanOrEqualToConstant: minWidth)
            widthConstraint?.isActive = true
        }

        // Apply corner radius
        layer.cornerRadius = size.height / 2

        // Apply variant styling
        backgroundColor = variant.backgroundColor
        titleLabel.textColor = variant.textColor
        loadingIndicator.color = variant.textColor

        // Apply border if needed
        if let borderColor = variant.borderColor {
            layer.borderColor = borderColor.cgColor
            layer.borderWidth = 2
        } else {
            layer.borderWidth = 0
        }

                // Apply typography
        titleLabel.font = UIFont.systemFont(ofSize: size.fontSize, weight: DesignTokens.fontWeightBold)

        // Apply letter spacing for XL size
        if size == .extraLarge {
            let attributedTitle = NSAttributedString(
                string: title,
                attributes: [
                    .kern: -0.36,
                    .font: UIFont.systemFont(ofSize: size.fontSize, weight: .semibold),
                    .foregroundColor: variant.textColor
                ]
            )
            titleLabel.attributedText = attributedTitle
        } else {
            titleLabel.text = title
        }

        // Content insets
        let insets = size.contentInsets
        titleLabel.frame = bounds.inset(by: insets)
    }

    private func updateTitle() {
        if size == .extraLarge {
            updateAppearance() // Reapply attributed text
        } else {
            titleLabel.text = title
        }
    }

    private func updateLoadingState() {
        if isLoading {
            titleLabel.isHidden = true
            loadingIndicator.startAnimating()
            isUserInteractionEnabled = false
        } else {
            titleLabel.isHidden = false
            loadingIndicator.stopAnimating()
            isUserInteractionEnabled = true
        }
    }

    // MARK: - Touch Handling

    @objc private func touchDown() {
        UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut) {
            self.transform = CGAffineTransform(scaleX: 0.98, y: 0.98)
        }
    }

    @objc private func touchUp() {
        UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut) {
            self.transform = .identity
        }
    }
}

// MARK: - Supporting Types

extension SonetelButton {
    enum ButtonSize {
        case extraSmall, small, medium, large, extraLarge

                var height: CGFloat {
            switch self {
            case .extraSmall: return 32
            case .small: return 40
            case .medium: return 36
            case .large: return 56
            case .extraLarge: return 56
            }
        }

                var fontSize: CGFloat {
            switch self {
            case .extraSmall: return DesignTokens.fontSizeXS
            case .small: return DesignTokens.fontSizeSM
            case .medium: return DesignTokens.fontSizeSM
            case .large: return DesignTokens.fontSizeLG
            case .extraLarge: return DesignTokens.fontSizeLG
            }
        }

        var minWidth: CGFloat? {
            switch self {
            case .medium: return 72
            case .extraLarge: return 280
            default: return nil
            }
        }

                var contentInsets: UIEdgeInsets {
            switch self {
            case .extraSmall: return UIEdgeInsets(top: DesignTokens.spacing02, left: DesignTokens.spacing04, bottom: DesignTokens.spacing02, right: DesignTokens.spacing04)
            case .small: return UIEdgeInsets(top: DesignTokens.spacing03, left: DesignTokens.spacing05, bottom: DesignTokens.spacing03, right: DesignTokens.spacing05)
            case .medium: return UIEdgeInsets(top: DesignTokens.spacing03, left: DesignTokens.spacing05, bottom: DesignTokens.spacing03, right: DesignTokens.spacing05)
            case .large: return UIEdgeInsets(top: DesignTokens.spacing05, left: DesignTokens.spacing07, bottom: DesignTokens.spacing05, right: DesignTokens.spacing07)
            case .extraLarge: return UIEdgeInsets(top: DesignTokens.spacing05, left: DesignTokens.spacing06, bottom: DesignTokens.spacing05, right: DesignTokens.spacing06)
            }
        }
    }

    enum ButtonVariant {
        case primary, secondary, outline, ghost, destructive, success

        var backgroundColor: UIColor {
            switch self {
            case .primary: return .solidZ7
            case .secondary: return .solidZ1
            case .outline: return .clear
            case .ghost: return .clear
            case .destructive: return .alertCritical
            case .success: return .accentsGreen
            }
        }

        var textColor: UIColor {
            switch self {
            case .primary: return .solidZ0
            case .secondary: return .solidZ7
            case .outline: return .solidZ7
            case .ghost: return .solidZ7
            case .destructive: return .solidZ0
            case .success: return .solidZ0
            }
        }

        var borderColor: UIColor? {
            switch self {
            case .outline: return .solidZ7
            default: return nil
            }
        }
    }
}
```

### SwiftUI Implementation

```swift
import SwiftUI

struct SonetelButton: View {
    let title: String
    let action: () -> Void

    var size: ButtonSize = .medium
    var variant: ButtonVariant = .primary
    var isLoading: Bool = false
    var isDisabled: Bool = false

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Color(variant.textColor)))
                        .scaleEffect(0.8)
                } else {
                    Text(title)
                        .font(.system(size: size.fontSize, weight: .semibold))
                        .kerning(size == .extraLarge ? -0.36 : 0)
                        .foregroundColor(Color(variant.textColor))
                }
            }
            .frame(minWidth: size.minWidth, minHeight: size.height)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .background(Color(variant.backgroundColor))
            .overlay(
                RoundedRectangle(cornerRadius: size.height / 2)
                    .stroke(
                        Color(variant.borderColor ?? .clear),
                        lineWidth: variant.borderColor != nil ? 2 : 0
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: size.height / 2))
        }
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        .onLongPressGesture(minimumDuration: 0, maximumDistance: .infinity, pressing: { pressing in
            isPressed = pressing
        }, perform: {})
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.5 : 1.0)
    }
}
```

## Android Implementation Guide

### Jetpack Compose Implementation

```kotlin
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SonetelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: ButtonSize = ButtonSize.Medium,
    variant: ButtonVariant = ButtonVariant.Primary,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }
) {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !isLoading) 0.98f else 1f,
        label = "button_scale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .scale(scale)
            .height(size.height)
            .let { mod ->
                size.minWidth?.let { minWidth ->
                    mod.widthIn(min = minWidth)
                } ?: mod
            },
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = variant.backgroundColor,
            contentColor = variant.textColor,
            disabledContainerColor = variant.backgroundColor.copy(alpha = 0.5f),
            disabledContentColor = variant.textColor.copy(alpha = 0.5f)
        ),
        border = variant.borderColor?.let { BorderStroke(2.dp, it) },
        shape = RoundedCornerShape(size.height / 2),
        contentPadding = PaddingValues(
            horizontal = size.horizontalPadding,
            vertical = size.verticalPadding
        ),
        interactionSource = interactionSource
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                color = variant.textColor,
                strokeWidth = 2.dp
            )
        } else {
            Text(
                text = text,
                fontSize = size.fontSize,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = if (size == ButtonSize.ExtraLarge) (-0.36).sp else 0.sp
            )
        }
    }
}

// Supporting types
enum class ButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val verticalPadding: Dp,
    val fontSize: TextUnit,
    val minWidth: Dp?
) {
    ExtraSmall(32.dp, 12.dp, 6.dp, 12.sp, null),
    Small(40.dp, 16.dp, 8.dp, 14.sp, null),
    Medium(36.dp, 16.dp, 8.dp, 14.sp, 72.dp),
    Large(56.dp, 24.dp, 16.dp, 18.sp, null),
    ExtraLarge(56.dp, 20.dp, 16.dp, 18.sp, 280.dp)
}

enum class ButtonVariant(
    val backgroundColor: Color,
    val textColor: Color,
    val borderColor: Color?
) {
    Primary(SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ0Light, null),
    Secondary(SonetelDesignTokens.solidZ1Light, SonetelDesignTokens.solidZ7Light, null),
    Outline(Color.Transparent, SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ7Light),
    Ghost(Color.Transparent, SonetelDesignTokens.solidZ7Light, null),
    Destructive(SonetelDesignTokens.alertCriticalLight, SonetelDesignTokens.solidZ0Light, null),
    Success(SonetelDesignTokens.accentsGreenLight, SonetelDesignTokens.solidZ0Light, null)
}
```

## Integration with Design Tokens

This component automatically uses the generated design tokens:

- **iOS**: References colors from `DesignSystemColors.swift`
- **Android**: References colors from `SonetelDesignTokens.kt` and XML resources
- **Typography**: Uses system fonts with specified sizes and weights
- **Spacing**: Uses standardized padding and sizing values

## Accessibility

### iOS Accessibility

```swift
// Add to setupButton()
isAccessibilityElement = true
accessibilityTraits = .button
accessibilityLabel = title
accessibilityHint = "Double tap to activate"

// Update for states
private func updateAccessibilityState() {
    accessibilityValue = isLoading ? "Loading" : nil
    accessibilityTraits = isLoading ? [.button, .updatesFrequently] : .button
}
```

### Android Accessibility

```kotlin
// Add to button modifier
.semantics {
    contentDescription = text
    role = Role.Button
    if (isLoading) {
        stateDescription = "Loading"
    }
}
```

## Usage Examples

### iOS Example

```swift
let primaryButton = SonetelButton()
primaryButton.title = "Continue"
primaryButton.size = .extraLarge
primaryButton.variant = .primary

// For loading state
primaryButton.isLoading = true
```

### Android Example

```kotlin
SonetelButton(
    text = "Continue",
    onClick = { /* handle click */ },
    size = ButtonSize.ExtraLarge,
    variant = ButtonVariant.Primary,
    isLoading = isProcessing
)
```

This specification ensures consistent button implementation across iOS and Android platforms while leveraging the generated design tokens from the design system.
