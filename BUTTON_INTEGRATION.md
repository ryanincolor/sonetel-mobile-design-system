# Button Component Integration Guide

This guide shows how to implement the Sonetel Design System Button component in native iOS and Android applications.

## Design Specifications

### X-Large Button (Primary from Figma)

- **Size**: 56px height × min 280px width
- **Padding**: 16px vertical, 20px horizontal
- **Border Radius**: 36px (fully rounded)
- **Background**: #0A0A0A (Solid.Z7 token)
- **Text Color**: #FFFFFF (Solid.Z0 token)
- **Font**: Inter, 18px, Semi-Bold (600)
- **Letter Spacing**: -0.36px
- **Line Height**: 20px

### Button Sizes

- **XS**: 32px height, 12px padding
- **SM**: 40px height, 16px padding
- **MD**: 48px height, 20px padding
- **LG**: 56px height, 24px padding
- **XL**: 56px height, 20px padding, min-width 280px

### Button Variants

- **Primary**: Dark background (#0A0A0A), white text
- **Secondary**: Light background, dark text
- **Outline**: Transparent background, border, text color
- **Ghost**: Transparent background, text color only
- **Destructive**: Red background for dangerous actions
- **Success**: Green background for positive actions

## iOS Implementation (Swift/UIKit)

### Basic Button Component

```swift
import UIKit

enum SonetelButtonSize {
    case xs, sm, md, lg, xl

    var height: CGFloat {
        switch self {
        case .xs: return 32
        case .sm: return 40
        case .md: return 48
        case .lg: return 56
        case .xl: return 56
        }
    }

    var padding: UIEdgeInsets {
        switch self {
        case .xs: return UIEdgeInsets(top: 6, left: 12, bottom: 6, right: 12)
        case .sm: return UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        case .md: return UIEdgeInsets(top: 12, left: 20, bottom: 12, right: 20)
        case .lg: return UIEdgeInsets(top: 16, left: 24, bottom: 16, right: 24)
        case .xl: return UIEdgeInsets(top: 16, left: 20, bottom: 16, right: 20)
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .xs: return 12
        case .sm: return 14
        case .md: return 16
        case .lg: return 18
        case .xl: return 18
        }
    }

    var minWidth: CGFloat? {
        switch self {
        case .xl: return 280
        default: return nil
        }
    }
}

enum SonetelButtonVariant {
    case primary, secondary, outline, ghost, destructive, success

    var backgroundColor: UIColor {
        switch self {
        case .primary: return .solidZ7 // #0A0A0A
        case .secondary: return .solidZ1 // Light gray
        case .outline: return .clear
        case .ghost: return .clear
        case .destructive: return .systemRed
        case .success: return .systemGreen
        }
    }

    var textColor: UIColor {
        switch self {
        case .primary: return .solidZ0 // #FFFFFF
        case .secondary: return .solidZ7
        case .outline: return .solidZ7
        case .ghost: return .solidZ7
        case .destructive: return .white
        case .success: return .white
        }
    }

    var borderColor: UIColor? {
        switch self {
        case .outline: return .solidZ7
        default: return nil
        }
    }
}

class SonetelButton: UIButton {

    var size: SonetelButtonSize = .md {
        didSet { updateAppearance() }
    }

    var variant: SonetelButtonVariant = .primary {
        didSet { updateAppearance() }
    }

    var isLoading: Bool = false {
        didSet { updateLoadingState() }
    }

    private var loadingIndicator: UIActivityIndicatorView?

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupButton()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }

    private func setupButton() {
        titleLabel?.font = UIFont.systemFont(ofSize: size.fontSize, weight: .semibold)
        updateAppearance()

        // Add touch feedback
        addTarget(self, action: #selector(touchDown), for: .touchDown)
        addTarget(self, action: #selector(touchUp), for: [.touchUpInside, .touchUpOutside, .touchCancel])
    }

    private func updateAppearance() {
        backgroundColor = variant.backgroundColor
        setTitleColor(variant.textColor, for: .normal)

        // Border
        if let borderColor = variant.borderColor {
            layer.borderColor = borderColor.cgColor
            layer.borderWidth = 2
        } else {
            layer.borderWidth = 0
        }

        // Corner radius (fully rounded)
        layer.cornerRadius = size.height / 2

        // Content insets
        contentEdgeInsets = size.padding

        // Font
        titleLabel?.font = UIFont.systemFont(ofSize: size.fontSize, weight: .semibold)

        // Letter spacing
        if size == .xl {
            let attributedTitle = NSAttributedString(
                string: titleLabel?.text ?? "",
                attributes: [
                    .kern: -0.36,
                    .font: UIFont.systemFont(ofSize: size.fontSize, weight: .semibold)
                ]
            )
            setAttributedTitle(attributedTitle, for: .normal)
        }

        // Height constraint
        heightAnchor.constraint(equalToConstant: size.height).isActive = true

        // Min width for XL
        if let minWidth = size.minWidth {
            widthAnchor.constraint(greaterThanOrEqualToConstant: minWidth).isActive = true
        }
    }

    private func updateLoadingState() {
        if isLoading {
            isEnabled = false

            // Create and add loading indicator
            loadingIndicator = UIActivityIndicatorView(style: .medium)
            loadingIndicator?.color = variant.textColor
            addSubview(loadingIndicator!)
            loadingIndicator?.center = CGPoint(x: bounds.width / 2, y: bounds.height / 2)
            loadingIndicator?.startAnimating()

            // Hide title
            setTitle("", for: .normal)
        } else {
            isEnabled = true
            loadingIndicator?.removeFromSuperview()
            loadingIndicator = nil
        }
    }

    @objc private func touchDown() {
        UIView.animate(withDuration: 0.1) {
            self.transform = CGAffineTransform(scaleX: 0.98, y: 0.98)
        }
    }

    @objc private func touchUp() {
        UIView.animate(withDuration: 0.1) {
            self.transform = .identity
        }
    }
}

// Usage Example
let primaryButton = SonetelButton()
primaryButton.size = .xl
primaryButton.variant = .primary
primaryButton.setTitle("Label", for: .normal)
```

### SwiftUI Implementation

```swift
import SwiftUI

struct SonetelButton: View {
    let title: String
    let size: SonetelButtonSize
    let variant: SonetelButtonVariant
    let isLoading: Bool
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: variant.textColor))
                        .scaleEffect(0.8)
                }

                if !isLoading {
                    Text(title)
                        .font(.system(size: size.fontSize, weight: .semibold))
                        .foregroundColor(Color(variant.textColor))
                        .kerning(size == .xl ? -0.36 : 0)
                }
            }
            .frame(minWidth: size.minWidth, minHeight: size.height)
            .padding(EdgeInsets(
                top: size.padding.top,
                leading: size.padding.left,
                bottom: size.padding.bottom,
                trailing: size.padding.right
            ))
            .background(Color(variant.backgroundColor))
            .cornerRadius(size.height / 2)
            .overlay(
                RoundedRectangle(cornerRadius: size.height / 2)
                    .stroke(
                        Color(variant.borderColor ?? .clear),
                        lineWidth: variant.borderColor != nil ? 2 : 0
                    )
            )
        }
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeInOut(duration: 0.1), value: isPressed)
        .onLongPressGesture(minimumDuration: 0, maximumDistance: .infinity, pressing: { pressing in
            isPressed = pressing
        }, perform: {})
        .disabled(isLoading)
    }
}
```

## Android Implementation (Kotlin/Jetpack Compose)

### Compose Button Component

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
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class SonetelButtonSize(
    val height: Dp,
    val paddingVertical: Dp,
    val paddingHorizontal: Dp,
    val fontSize: TextUnit,
    val minWidth: Dp?
) {
    XS(32.dp, 6.dp, 12.dp, 12.sp, null),
    SM(40.dp, 8.dp, 16.dp, 14.sp, null),
    MD(48.dp, 12.dp, 20.dp, 16.sp, null),
    LG(56.dp, 16.dp, 24.dp, 18.sp, null),
    XL(56.dp, 16.dp, 20.dp, 18.sp, 280.dp)
}

enum class SonetelButtonVariant(
    val backgroundColor: Color,
    val textColor: Color,
    val borderColor: Color?
) {
    Primary(Color(0xFF0A0A0A), Color(0xFFFFFFFF), null),
    Secondary(Color(0xFFF5F5F5), Color(0xFF0A0A0A), null),
    Outline(Color.Transparent, Color(0xFF0A0A0A), Color(0xFF0A0A0A)),
    Ghost(Color.Transparent, Color(0xFF0A0A0A), null),
    Destructive(Color.Red, Color.White, null),
    Success(Color.Green, Color.White, null)
}

@Composable
fun SonetelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: SonetelButtonSize = SonetelButtonSize.MD,
    variant: SonetelButtonVariant = SonetelButtonVariant.Primary,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }
) {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.98f else 1f,
        label = "button_scale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .scale(scale)
            .height(size.height)
            .then(
                if (size.minWidth != null) {
                    Modifier.widthIn(min = size.minWidth)
                } else {
                    Modifier
                }
            ),
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = variant.backgroundColor,
            contentColor = variant.textColor,
            disabledContainerColor = variant.backgroundColor.copy(alpha = 0.5f),
            disabledContentColor = variant.textColor.copy(alpha = 0.5f)
        ),
        border = variant.borderColor?.let {
            BorderStroke(2.dp, it)
        },
        shape = RoundedCornerShape(size.height / 2),
        contentPadding = PaddingValues(
            horizontal = size.paddingHorizontal,
            vertical = size.paddingVertical
        ),
        interactionSource = interactionSource
    ) {
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
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
                    letterSpacing = if (size == SonetelButtonSize.XL) (-0.36).sp else 0.sp
                )
            }
        }
    }
}

// Usage Examples
@Composable
fun ButtonExamples() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // X-Large Primary Button (Figma design)
        SonetelButton(
            text = "Label",
            onClick = { },
            size = SonetelButtonSize.XL,
            variant = SonetelButtonVariant.Primary
        )

        // Loading button
        SonetelButton(
            text = "Processing",
            onClick = { },
            size = SonetelButtonSize.LG,
            variant = SonetelButtonVariant.Primary,
            isLoading = true
        )

        // Outline button
        SonetelButton(
            text = "Secondary Action",
            onClick = { },
            size = SonetelButtonSize.MD,
            variant = SonetelButtonVariant.Outline
        )
    }
}
```

### Traditional Android Views (XML + Kotlin)

```xml
<!-- Custom button style in styles.xml -->
<style name="SonetelButton.Primary.XL">
    <item name="android:layout_height">56dp</item>
    <item name="android:layout_width">wrap_content</item>
    <item name="android:minWidth">280dp</item>
    <item name="android:paddingHorizontal">20dp</item>
    <item name="android:paddingVertical">16dp</item>
    <item name="android:background">@drawable/button_primary_background</item>
    <item name="android:textColor">@color/solid_z0</item>
    <item name="android:textSize">18sp</item>
    <item name="android:fontFamily">@font/inter</item>
    <item name="android:textStyle">bold</item>
    <item name="android:letterSpacing">-0.02</item>
    <item name="android:gravity">center</item>
    <item name="android:textAllCaps">false</item>
</style>
```

```xml
<!-- button_primary_background.xml drawable -->
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
    android:color="@color/solid_z5">
    <item android:id="@android:id/background">
        <shape android:shape="rectangle">
            <solid android:color="@color/solid_z7" />
            <corners android:radius="28dp" />
        </shape>
    </item>
</ripple>
```

## Integration with Design Tokens

Make sure to reference the generated design tokens from the build system:

### iOS

- Use the generated `DesignSystemColors.swift` file
- Colors: `UIColor.solidZ7`, `UIColor.solidZ0`, etc.
- Typography: `DesignSystemTypography.labelXLarge`, etc.

### Android

- Use the generated XML resources in `values/design_colors.xml`
- Colors: `@color/solid_z7`, `@color/solid_z0`, etc.
- Dimensions: `@dimen/spacing_lg`, etc.

## Accessibility Guidelines

### iOS

- Set `accessibilityTraits` to `.button`
- Provide descriptive `accessibilityLabel`
- Support Dynamic Type scaling
- Ensure minimum 44pt touch target

### Android

- Use `contentDescription` for screen readers
- Support font scaling (sp units)
- Ensure minimum 48dp touch target
- Add state descriptions for loading/disabled states

## Testing Considerations

1. **Touch Target Size**: Ensure minimum 44pt (iOS) / 48dp (Android)
2. **Contrast Ratios**: Verify WCAG AA compliance (4.5:1 minimum)
3. **Dark Mode**: Test all variants in both light and dark themes
4. **Font Scaling**: Test with different accessibility font sizes
5. **Loading States**: Verify loading indicators work properly
6. **Disabled States**: Ensure proper visual feedback

This implementation provides a consistent button experience across web, iOS, and Android platforms while maintaining the exact specifications from the Figma design.
