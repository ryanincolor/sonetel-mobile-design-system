// Sonetel Material 3 Typography
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.sonetel.designsystem.SonetelDesignTokens

/**
 * Material 3 Typography using Sonetel design tokens
 * Provides semantic text styles for consistent typography across the app
 */
val SonetelMaterial3Typography = Typography(
    // Display styles
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize3xl,
                lineHeight = SonetelDesignTokens.lineHeight40,
        letterSpacing = (-0.25).sp
    ),
    displayMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize2xl,
                lineHeight = SonetelDesignTokens.lineHeight32,
        letterSpacing = 0.sp
    ),
    displaySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXl,
                lineHeight = SonetelDesignTokens.lineHeight29,
        letterSpacing = 0.sp
    ),

    // Headline styles
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
                lineHeight = SonetelDesignTokens.lineHeight24,
        letterSpacing = 0.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeMd,
                lineHeight = SonetelDesignTokens.lineHeight20,
        letterSpacing = 0.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeSm,
                lineHeight = SonetelDesignTokens.lineHeight20,
        letterSpacing = 0.sp
    ),

    // Title styles
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
                lineHeight = SonetelDesignTokens.lineHeight24,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeMd,
                lineHeight = SonetelDesignTokens.lineHeight24,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
                lineHeight = SonetelDesignTokens.lineHeight20,
        letterSpacing = 0.1.sp
    ),

    // Body styles
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeMd,
                lineHeight = SonetelDesignTokens.lineHeight24,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeSm,
                lineHeight = SonetelDesignTokens.lineHeight20,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXs,
                lineHeight = SonetelDesignTokens.lineHeight16,
        letterSpacing = 0.4.sp
    ),

    // Label styles
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
                lineHeight = SonetelDesignTokens.lineHeight20,
        letterSpacing = 0.1.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXs,
                lineHeight = SonetelDesignTokens.lineHeight16,
        letterSpacing = 0.5.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXxs,
                lineHeight = SonetelDesignTokens.lineHeight16,
        letterSpacing = 0.5.sp
        )
)

/**
 * Complete Sonetel Typography with all Figma variations
 * Use these for exact design system compliance with Light/Regular/Prominent weights
 */
object SonetelTypography {

    // Display medium variants (64px, 64px line height, -2% letter spacing)
    object DisplayMedium {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Light,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize5xl,  // 64sp
            lineHeight = SonetelDesignTokens.lineHeight64,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline 3xl variants (40px, 46px line height, -2% letter spacing)
    object Headline3xl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize4xl,  // 40sp
            lineHeight = SonetelDesignTokens.lineHeight46,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline 2xl variants (34px, 40px line height, -2% letter spacing)
    object Headline2xl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize3xl,  // 34sp
            lineHeight = SonetelDesignTokens.lineHeight40,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline XL variants (28px, 32px line height, -2% letter spacing)
    object HeadlineXl {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSize2xl,  // 28sp
            lineHeight = SonetelDesignTokens.lineHeight32,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline large variants (24px, 29px line height, -2% letter spacing)
    object HeadlineLarge {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeXl,  // 24sp
            lineHeight = SonetelDesignTokens.lineHeight29,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline medium variants (20px, 24px line height, -2% letter spacing)
    object HeadlineMedium {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

    // Headline small variants (18px, 22px line height, -2% letter spacing)
    object HeadlineSmall {
        val light = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val regular = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.SemiBold,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val prominent = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Bold,
            fontSize = SonetelDesignTokens.fontSizeBase,  // 18sp
            lineHeight = SonetelDesignTokens.lineHeight22,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

            // Label styles for buttons and UI elements
    object Label {
        val small = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXxs,  // 11sp
            lineHeight = SonetelDesignTokens.lineHeight16,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val medium = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeXs,  // 12sp
            lineHeight = SonetelDesignTokens.lineHeight16,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

        val large = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeSm,  // 14sp
            lineHeight = SonetelDesignTokens.lineHeight20,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )

                        val xlarge = TextStyle(
            fontFamily = FontFamily.Default,
            fontWeight = FontWeight.Medium,
            fontSize = SonetelDesignTokens.fontSizeMd,  // 16sp
            lineHeight = SonetelDesignTokens.lineHeight24,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        )
    }

            // Body text styles (with Regular and Prominent variants)
    object Body {
        object small {
            val regular = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Normal,
                fontSize = SonetelDesignTokens.fontSizeXs,  // 12sp
                lineHeight = SonetelDesignTokens.lineHeight16,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )

            val prominent = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Medium,
                fontSize = SonetelDesignTokens.fontSizeXs,  // 12sp
                lineHeight = SonetelDesignTokens.lineHeight16,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )
        }

        object medium {
            val regular = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Normal,
                fontSize = SonetelDesignTokens.fontSizeSm,  // 14sp
                lineHeight = SonetelDesignTokens.lineHeight18,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )

            val prominent = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Medium,
                fontSize = SonetelDesignTokens.fontSizeSm,  // 14sp
                lineHeight = SonetelDesignTokens.lineHeight18,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )
        }

        object large {
            val regular = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Normal,
                fontSize = SonetelDesignTokens.fontSizeMd,  // 16sp
                lineHeight = SonetelDesignTokens.lineHeight20,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )

            val prominent = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Medium,
                fontSize = SonetelDesignTokens.fontSizeMd,  // 16sp
                lineHeight = SonetelDesignTokens.lineHeight20,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )
        }

        object xlarge {
            val regular = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Normal,
                fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
                lineHeight = SonetelDesignTokens.lineHeight22,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )

            val prominent = TextStyle(
                fontFamily = FontFamily.Default,
                fontWeight = FontWeight.Medium,
                fontSize = SonetelDesignTokens.fontSizeLg,  // 20sp
                lineHeight = SonetelDesignTokens.lineHeight22,
                letterSpacing = SonetelDesignTokens.letterSpacingTight
            )
        }
    }
}
