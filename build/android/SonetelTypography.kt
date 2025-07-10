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
val SonetelTypography = Typography(
    // Display styles
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize3xl,
        lineHeight = (SonetelDesignTokens.fontSize3xl.value * 1.12f).sp,
        letterSpacing = (-0.25).sp
    ),
    displayMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSize2xl,
        lineHeight = (SonetelDesignTokens.fontSize2xl.value * 1.16f).sp,
        letterSpacing = 0.sp
    ),
    displaySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXl,
        lineHeight = (SonetelDesignTokens.fontSizeXl.value * 1.22f).sp,
        letterSpacing = 0.sp
    ),

    // Headline styles
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
        lineHeight = (SonetelDesignTokens.fontSizeLg.value * 1.25f).sp,
        letterSpacing = 0.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.25f).sp,
        letterSpacing = 0.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.33f).sp,
        letterSpacing = 0.sp
    ),

    // Title styles
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = SonetelDesignTokens.fontSizeLg,
        lineHeight = (SonetelDesignTokens.fontSizeLg.value * 1.28f).sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.5f).sp,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.1.sp
    ),

    // Body styles
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeMd,
        lineHeight = (SonetelDesignTokens.fontSizeMd.value * 1.5f).sp,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = SonetelDesignTokens.fontSizeXs,
        lineHeight = (SonetelDesignTokens.fontSizeXs.value * 1.33f).sp,
        letterSpacing = 0.4.sp
    ),

    // Label styles
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeSm,
        lineHeight = (SonetelDesignTokens.fontSizeSm.value * 1.43f).sp,
        letterSpacing = 0.1.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXs,
        lineHeight = (SonetelDesignTokens.fontSizeXs.value * 1.33f).sp,
        letterSpacing = 0.5.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = SonetelDesignTokens.fontSizeXxs,
        lineHeight = (SonetelDesignTokens.fontSizeXxs.value * 1.45f).sp,
        letterSpacing = 0.5.sp
    )
)
