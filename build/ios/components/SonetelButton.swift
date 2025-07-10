// Sonetel Button Component - SwiftUI
// Auto-generated on 7/10/2025 - Do not edit manually

import SwiftUI

/**
 * Sonetel Button Component
 *
 * A SwiftUI button that follows Sonetel design system specifications.
 * Supports multiple sizes, variants, and states with consistent styling.
 */
public struct SonetelButton: View {
    let title: String
    let action: () -> Void

    var size: SonetelButtonSize = .medium
    var variant: SonetelButtonVariant = .primary
    var isLoading: Bool = false
    var isDisabled: Bool = false

    @State private var isPressed = false

    public init(
        title: String,
        action: @escaping () -> Void,
        size: SonetelButtonSize = .medium,
        variant: SonetelButtonVariant = .primary,
        isLoading: Bool = false,
        isDisabled: Bool = false
    ) {
        self.title = title
        self.action = action
        self.size = size
        self.variant = variant
        self.isLoading = isLoading
        self.isDisabled = isDisabled
    }

    public var body: some View {
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
            .padding(.vertical, size.verticalPadding)
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

/**
 * Button size variants with design token values
 */
public enum SonetelButtonSize {
    case extraSmall, small, medium, large, extraLarge

        var height: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacing4xl
        case .small: return DesignSystemSpacing.spacing10xl
        case .medium: return DesignSystemSpacing.spacing4xl + 4
        case .large: return DesignSystemSpacing.spacing6xl
        case .extraLarge: return DesignSystemSpacing.spacing7xl
        }
    }

        var fontSize: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemTypography.fontSizeLabelSmall
        case .small: return DesignSystemTypography.fontSizeLabelMedium
        case .medium: return DesignSystemTypography.fontSizeLabelMedium
        case .large: return DesignSystemTypography.fontSizeLabelLarge
        case .extraLarge: return DesignSystemTypography.fontSizeLabelXLarge
        }
    }

        var minWidth: CGFloat? {
        switch self {
        case .medium: return DesignSystemSpacing.spacing9xl
        case .large: return DesignSystemSpacing.spacing10xl
                case .extraLarge: return 280
        default: return nil
        }
    }

        var horizontalPadding: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacingM
        case .small: return DesignSystemSpacing.spacingL
        case .medium: return DesignSystemSpacing.spacingL
        case .large: return DesignSystemSpacing.spacingXl
        case .extraLarge: return DesignSystemSpacing.spacingXl
        }
    }

    var verticalPadding: CGFloat {
        switch self {
        case .extraSmall: return DesignSystemSpacing.spacingXs
        case .small: return DesignSystemSpacing.spacingS
        case .medium: return DesignSystemSpacing.spacingS
        case .large: return DesignSystemSpacing.spacingL
        case .extraLarge: return DesignSystemSpacing.spacingL
        }
    }
}

/**
 * Button style variants using design tokens
 */
public enum SonetelButtonVariant {
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

/**
 * Preview for SwiftUI previews and development
 */
struct SonetelButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 16) {
            // Size variants
            ForEach([SonetelButtonSize.extraSmall, .small, .medium, .large, .extraLarge], id: \.self) { size in
                SonetelButton(
                    title: "\(size)",
                    action: { },
                    size: size
                )
            }

            // Style variants
            ForEach([SonetelButtonVariant.primary, .secondary, .outline, .ghost, .destructive, .success], id: \.self) { variant in
                SonetelButton(
                    title: "\(variant)",
                    action: { },
                    variant: variant
                )
            }
        }
        .padding()
    }
}
