// Design System Spacing - iOS Best Practices
// Auto-generated on 7/10/2025 - Do not edit manually

import UIKit

public struct DesignSystemSpacing {
    
    // MARK: - Spacing Values
    
    /// spacing.2xs
    public static let spacing2xs: CGFloat = 2
    /// spacing.s
    public static let spacingS: CGFloat = 8
    /// spacing.2xl
    public static let spacing2xl: CGFloat = 24
    /// spacing.m
    public static let spacingM: CGFloat = 12
    /// spacing.xl
    public static let spacingXl: CGFloat = 20
    /// spacing.xs
    public static let spacingXs: CGFloat = 4
    /// spacing.l
    public static let spacingL: CGFloat = 16
    /// spacing.6xl
    public static let spacing6xl: CGFloat = 48
    /// spacing.3xl
    public static let spacing3xl: CGFloat = 28
    /// spacing.4xl
    public static let spacing4xl: CGFloat = 32
    /// spacing.5xl
    public static let spacing5xl: CGFloat = 20
    /// spacing.7xl
    public static let spacing7xl: CGFloat = 56
    /// spacing.8xl
    public static let spacing8xl: CGFloat = 64
    /// spacing.9xl
    public static let spacing9xl: CGFloat = 72
    /// spacing.10xl
    public static let spacing10xl: CGFloat = 80
    /// spacing.11xl
    public static let spacing11xl: CGFloat = 96
    /// spacing.12xl
    public static let spacing12xl: CGFloat = 128

    
    // MARK: - Border Radius Values
    
    /// large
    public static let large: CGFloat = 20
    /// medium
    public static let medium: CGFloat = 16
    /// small
    public static let small: CGFloat = 8

}

// MARK: - UIEdgeInsets Extensions
extension UIEdgeInsets {
    
    /// Create insets with same value for all sides
    public static func all(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: value, bottom: value, right: value)
    }
    
    /// Create horizontal insets
    public static func horizontal(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: 0, left: value, bottom: 0, right: value)
    }
    
    /// Create vertical insets
    public static func vertical(_ value: CGFloat) -> UIEdgeInsets {
        return UIEdgeInsets(top: value, left: 0, bottom: value, right: 0)
    }
}