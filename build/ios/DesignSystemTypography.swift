// Design System Typography - iOS Best Practices
// Auto-generated on 7/10/2025 - Do not edit manually

import UIKit

public struct DesignSystemTypography {
    
    // MARK: - Font Sizes (Dynamic Type Compatible)
    
    /// font-size.headline.h1
    public static let fontSizeHeadlineH1: CGFloat = 40
    /// font-size.headline.h2
    public static let fontSizeHeadlineH2: CGFloat = 34
    /// font-size.headline.h3
    public static let fontSizeHeadlineH3: CGFloat = 28
    /// font-size.headline.h4
    public static let fontSizeHeadlineH4: CGFloat = 24
    /// font-size.headline.h5
    public static let fontSizeHeadlineH5: CGFloat = 20
    /// font-size.headline.h6
    public static let fontSizeHeadlineH6: CGFloat = 18
    /// font-size.label.x-large
    public static let fontSizeLabelXLarge: CGFloat = 18
    /// font-size.label.large
    public static let fontSizeLabelLarge: CGFloat = 16
    /// font-size.label.medium
    public static let fontSizeLabelMedium: CGFloat = 14
    /// font-size.label.small
    public static let fontSizeLabelSmall: CGFloat = 12
    /// font-size.display.large
    public static let fontSizeDisplayLarge: CGFloat = 72
    /// font-size.display.medium
    public static let fontSizeDisplayMedium: CGFloat = 64
    /// font-size.display.small
    public static let fontSizeDisplaySmall: CGFloat = 56
    /// font-size.display.xl
    public static let fontSizeDisplayXl: CGFloat = 96
    /// font-size.body.x-large
    public static let fontSizeBodyXLarge: CGFloat = 18
    /// font-size.body.large
    public static let fontSizeBodyLarge: CGFloat = 16
    /// font-size.body.medium
    public static let fontSizeBodyMedium: CGFloat = 14
    /// font-size.body.small
    public static let fontSizeBodySmall: CGFloat = 12
    /// line-height.headline.h1
    public static let lineHeightHeadlineH1: CGFloat = 46
    /// line-height.headline.h2
    public static let lineHeightHeadlineH2: CGFloat = 40
    /// line-height.headline.h3
    public static let lineHeightHeadlineH3: CGFloat = 34
    /// line-height.headline.h4
    public static let lineHeightHeadlineH4: CGFloat = 29
    /// line-height.headline.h5
    public static let lineHeightHeadlineH5: CGFloat = 24
    /// line-height.headline.h6
    public static let lineHeightHeadlineH6: CGFloat = 22
    /// line-height.label.x-large
    public static let lineHeightLabelXLarge: CGFloat = 20
    /// line-height.label.large
    public static let lineHeightLabelLarge: CGFloat = 18
    /// line-height.label.medium
    public static let lineHeightLabelMedium: CGFloat = 16
    /// line-height.label.small
    public static let lineHeightLabelSmall: CGFloat = 14
    /// line-height.display.xl
    public static let lineHeightDisplayXl: CGFloat = 96
    /// line-height.display.large
    public static let lineHeightDisplayLarge: CGFloat = 80
    /// line-height.display.medium
    public static let lineHeightDisplayMedium: CGFloat = 64
    /// line-height.display.small
    public static let lineHeightDisplaySmall: CGFloat = 56
    /// line-height.body.x-large
    public static let lineHeightBodyXLarge: CGFloat = 22
    /// line-height.body.large
    public static let lineHeightBodyLarge: CGFloat = 20
    /// line-height.body.medium
    public static let lineHeightBodyMedium: CGFloat = 18
    /// line-height.body.small
    public static let lineHeightBodySmall: CGFloat = 16

    
    // MARK: - Convenience Methods
    
    /// Get system font with design system size
    public static func systemFont(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight)
    }
    
    /// Get rounded system font with design system size
    public static func roundedSystemFont(size: CGFloat, weight: UIFont.Weight = .regular) -> UIFont {
        return UIFont.systemFont(ofSize: size, weight: weight, width: .standard)
    }
}

// MARK: - SwiftUI Support
#if canImport(SwiftUI)
import SwiftUI

@available(iOS 13.0, *)
extension Font {
    
    /// font-size.headline.h1
    static let fontSizeHeadlineH1 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH1)
    /// font-size.headline.h2
    static let fontSizeHeadlineH2 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH2)
    /// font-size.headline.h3
    static let fontSizeHeadlineH3 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH3)
    /// font-size.headline.h4
    static let fontSizeHeadlineH4 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH4)
    /// font-size.headline.h5
    static let fontSizeHeadlineH5 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH5)
    /// font-size.headline.h6
    static let fontSizeHeadlineH6 = Font.system(size: DesignSystemTypography.fontSizeHeadlineH6)
    /// font-size.label.x-large
    static let fontSizeLabelXLarge = Font.system(size: DesignSystemTypography.fontSizeLabelXLarge)
    /// font-size.label.large
    static let fontSizeLabelLarge = Font.system(size: DesignSystemTypography.fontSizeLabelLarge)
    /// font-size.label.medium
    static let fontSizeLabelMedium = Font.system(size: DesignSystemTypography.fontSizeLabelMedium)
    /// font-size.label.small
    static let fontSizeLabelSmall = Font.system(size: DesignSystemTypography.fontSizeLabelSmall)
    /// font-size.display.large
    static let fontSizeDisplayLarge = Font.system(size: DesignSystemTypography.fontSizeDisplayLarge)
    /// font-size.display.medium
    static let fontSizeDisplayMedium = Font.system(size: DesignSystemTypography.fontSizeDisplayMedium)
    /// font-size.display.small
    static let fontSizeDisplaySmall = Font.system(size: DesignSystemTypography.fontSizeDisplaySmall)
    /// font-size.display.xl
    static let fontSizeDisplayXl = Font.system(size: DesignSystemTypography.fontSizeDisplayXl)
    /// font-size.body.x-large
    static let fontSizeBodyXLarge = Font.system(size: DesignSystemTypography.fontSizeBodyXLarge)
    /// font-size.body.large
    static let fontSizeBodyLarge = Font.system(size: DesignSystemTypography.fontSizeBodyLarge)
    /// font-size.body.medium
    static let fontSizeBodyMedium = Font.system(size: DesignSystemTypography.fontSizeBodyMedium)
    /// font-size.body.small
    static let fontSizeBodySmall = Font.system(size: DesignSystemTypography.fontSizeBodySmall)
    /// line-height.headline.h1
    static let lineHeightHeadlineH1 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH1)
    /// line-height.headline.h2
    static let lineHeightHeadlineH2 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH2)
    /// line-height.headline.h3
    static let lineHeightHeadlineH3 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH3)
    /// line-height.headline.h4
    static let lineHeightHeadlineH4 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH4)
    /// line-height.headline.h5
    static let lineHeightHeadlineH5 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH5)
    /// line-height.headline.h6
    static let lineHeightHeadlineH6 = Font.system(size: DesignSystemTypography.lineHeightHeadlineH6)
    /// line-height.label.x-large
    static let lineHeightLabelXLarge = Font.system(size: DesignSystemTypography.lineHeightLabelXLarge)
    /// line-height.label.large
    static let lineHeightLabelLarge = Font.system(size: DesignSystemTypography.lineHeightLabelLarge)
    /// line-height.label.medium
    static let lineHeightLabelMedium = Font.system(size: DesignSystemTypography.lineHeightLabelMedium)
    /// line-height.label.small
    static let lineHeightLabelSmall = Font.system(size: DesignSystemTypography.lineHeightLabelSmall)
    /// line-height.display.xl
    static let lineHeightDisplayXl = Font.system(size: DesignSystemTypography.lineHeightDisplayXl)
    /// line-height.display.large
    static let lineHeightDisplayLarge = Font.system(size: DesignSystemTypography.lineHeightDisplayLarge)
    /// line-height.display.medium
    static let lineHeightDisplayMedium = Font.system(size: DesignSystemTypography.lineHeightDisplayMedium)
    /// line-height.display.small
    static let lineHeightDisplaySmall = Font.system(size: DesignSystemTypography.lineHeightDisplaySmall)
    /// line-height.body.x-large
    static let lineHeightBodyXLarge = Font.system(size: DesignSystemTypography.lineHeightBodyXLarge)
    /// line-height.body.large
    static let lineHeightBodyLarge = Font.system(size: DesignSystemTypography.lineHeightBodyLarge)
    /// line-height.body.medium
    static let lineHeightBodyMedium = Font.system(size: DesignSystemTypography.lineHeightBodyMedium)
    /// line-height.body.small
    static let lineHeightBodySmall = Font.system(size: DesignSystemTypography.lineHeightBodySmall)

}
#endif