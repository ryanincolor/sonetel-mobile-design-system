// Sonetel Material 3 Theme Integration
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

/**
 * Complete Sonetel Material 3 theme
 * Use this composable to wrap your app content with consistent theming
 *
 * Usage:
 * SonetelTheme {
 *     // Your app content here
 * }
 */
@Composable
fun SonetelTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        SonetelColorScheme.DarkColorScheme
    } else {
        SonetelColorScheme.LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = SonetelTypography,
        shapes = SonetelShapes,
        content = content
    )
}

/**
 * Use this for components that need to access design tokens directly
 * while still being wrapped in Material 3 theme
 */
@Composable
fun SonetelThemeWithTokens(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    SonetelTheme(darkTheme = darkTheme) {
        content()
    }
}
