// Sonetel Material 3 Theme
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import com.sonetel.designsystem.SonetelDesignTokens

/**
 * Material 3 color schemes using Sonetel design tokens
 */
object SonetelColorScheme {

    val LightColorScheme = lightColorScheme(
                primary = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight,
        onPrimary = SonetelDesignTokens.solidZ0Light,
        surface = SonetelDesignTokens.solidZ0Light,
        onSurface = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight,
        background = SonetelDesignTokens.solidZ0Light,
        onBackground = SonetelDesignTokens.onSurfaceOnSurfacePrimaryLight,
        // Add more Material 3 color mappings as needed
    )

    val DarkColorScheme = darkColorScheme(
                        primary = SonetelDesignTokens.onSurfaceOnSurfacePrimaryDark,
        onPrimary = SonetelDesignTokens.solidZ0Dark,
        surface = SonetelDesignTokens.solidZ0Dark,
        onSurface = SonetelDesignTokens.onSurfaceOnSurfacePrimaryDark,
        background = SonetelDesignTokens.solidZ0Dark,
        onBackground = SonetelDesignTokens.onSurfaceOnSurfacePrimaryDark,
        // Add more Material 3 color mappings as needed
    )
}