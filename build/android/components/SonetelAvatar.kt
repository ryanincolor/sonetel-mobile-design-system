// Sonetel Avatar Component - Jetpack Compose
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.designsystem.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

/**
 * Sonetel Avatar Component
 *
 * A circular avatar component using design system tokens and exact Figma design.
 * Shows a default user icon when no photo is provided.
 *
 * @param modifier Modifier to be applied to the avatar
 * @param size Size of the avatar (default 44dp)
 */
@Composable
fun SonetelAvatar(
    modifier: Modifier = Modifier,
    size: androidx.compose.ui.unit.Dp = 44.dp
) {
    Canvas(
        modifier = modifier.size(size)
    ) {
        val canvasSize = this.size
        val scale = canvasSize.width / 44f // Scale factor from original 44px design
        
        // Draw background circle (T1 - 4% black)
        drawCircle(
            color = Color.Black.copy(alpha = 0.04f),
            radius = 22f * scale,
            center = androidx.compose.ui.geometry.Offset(22f * scale, 22f * scale)
        )
        
        // Draw user icon (T3 - 12% black)
        drawUserIcon(scale)
    }
}

/**
 * Draws the user icon using the exact Figma SVG path
 */
private fun DrawScope.drawUserIcon(scale: Float) {
    val userIconPath = Path().apply {
        // Exact path from Figma SVG
        moveTo(0.832031f * scale, 30.1568f * scale)
        cubicTo(3.89087f * scale, 25.7239f * scale, 9.76215f * scale, 22.692f * scale, 15.167f * scale, 22.692f * scale)
        lineTo(18.3754f * scale, 22.692f * scale)
        cubicTo(23.7797f * scale, 22.692f * scale, 29.6593f * scale, 25.7249f * scale, 32.7223f * scale, 30.1589f * scale)
        cubicTo(28.7144f * scale, 34.3731f * scale, 23.0531f * scale, 37.0002f * scale, 16.7782f * scale, 37.0002f * scale)
        cubicTo(10.5022f * scale, 37.0002f * scale, 4.84006f * scale, 34.3722f * scale, 0.832031f * scale, 30.1568f * scale)
        close()
        
        moveTo(16.7781f * scale, 19.1252f * scale)
        cubicTo(11.7964f * scale, 19.1252f * scale, 7.74239f * scale, 14.7144f * scale, 7.74239f * scale, 9.78973f * scale)
        cubicTo(7.74239f * scale, 4.86504f * scale, 11.7964f * scale, 0.333496f * scale, 16.7781f * scale, 0.333496f * scale)
        cubicTo(21.7598f * scale, 0.333496f * scale, 25.8138f * scale, 4.86504f * scale, 25.8138f * scale, 9.78973f * scale)
        cubicTo(25.8138f * scale, 14.7144f * scale, 21.7598f * scale, 19.1252f * scale, 16.7781f * scale, 19.1252f * scale)
        close()
    }
    
    // Translate to proper position (6px, 7px from container)
    translate(left = 6f * scale, top = 7f * scale) {
        drawPath(
            path = userIconPath,
            color = Color.Black.copy(alpha = 0.12f)
        )
    }
}

/**
 * Preview composables for development and testing
 */
@Preview(showBackground = true)
@Composable
internal fun SonetelAvatarPreview() {
    Row(
        modifier = Modifier.padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Default size
        SonetelAvatar()
        
        // Different sizes
        SonetelAvatar(size = 32.dp)
        SonetelAvatar(size = 56.dp)
        SonetelAvatar(size = 80.dp)
    }
}
