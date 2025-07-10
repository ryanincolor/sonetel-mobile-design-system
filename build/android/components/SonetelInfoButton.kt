// Sonetel Info Button Component - Jetpack Compose
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.designsystem.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

/**
 * Sonetel Info Button Component
 *
 * A circular info button using design system tokens and exact Figma design.
 * Shows an info icon with Material 3 ripple effect.
 *
 * @param onClick Called when the button is clicked
 * @param modifier Modifier to be applied to the button
 * @param size Size of the button container (default 48dp)
 */
@Composable
fun SonetelInfoButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: androidx.compose.ui.unit.Dp = 48.dp
) {
    val interactionSource = remember { MutableInteractionSource() }
    
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(bounded = true, radius = size / 2)
            ) { onClick() },
        contentAlignment = Alignment.Center
    ) {
        // Inner button area (36dp from Figma)
        Canvas(
            modifier = Modifier.size(36.dp)
        ) {
            val canvasSize = this.size
            val scale = canvasSize.width / 24f // Scale factor from original 24px SVG
            
            // Draw info icon (T5 - 60% black)
            drawInfoIcon(scale)
        }
    }
}

/**
 * Draws the info icon using the exact Figma SVG path
 */
private fun DrawScope.drawInfoIcon(scale: Float) {
    val infoIconPath = Path().apply {
        // Exact path from Figma SVG
        moveTo(12.3008f * scale, 0.336914f * scale)
        cubicTo(18.6048f * scale, 0.496622f * scale, 23.6658f * scale, 5.6575f * scale, 23.666f * scale, 12f * scale)
        lineTo(23.6621f * scale, 12.3008f * scale)
        cubicTo(23.5024f * scale, 18.6048f * scale, 18.3425f * scale, 23.6658f * scale, 12f * scale, 23.666f * scale)
        lineTo(11.6982f * scale, 23.6621f * scale)
        cubicTo(5.49445f * scale, 23.5046f * scale, 0.494084f * scale, 18.5047f * scale, 0.336914f * scale, 12.3008f * scale)
        lineTo(0.333008f * scale, 12f * scale)
        cubicTo(0.333184f * scale, 5.55694f * scale, 5.55694f * scale, 0.333184f * scale, 12f * scale, 0.333008f * scale)
        lineTo(12.3008f * scale, 0.336914f * scale)
        close()
        
        moveTo(12f * scale, 2.33301f * scale)
        cubicTo(6.66151f * scale, 2.33318f * scale, 2.33318f * scale, 6.66151f * scale, 2.33301f * scale, 12f * scale)
        cubicTo(2.33318f * scale, 17.3385f * scale, 6.66151f * scale, 21.6658f * scale, 12f * scale, 21.666f * scale)
        cubicTo(17.3385f * scale, 21.6658f * scale, 21.6658f * scale, 17.3385f * scale, 21.666f * scale, 12f * scale)
        cubicTo(21.6658f * scale, 6.66151f * scale, 17.3385f * scale, 2.33318f * scale, 12f * scale, 2.33301f * scale)
        close()
        
        moveTo(11.9941f * scale, 11f * scale)
        cubicTo(12.5463f * scale, 11.0001f * scale, 12.9941f * scale, 11.4479f * scale, 12.9941f * scale, 12f * scale)
        lineTo(12.9941f * scale, 16.667f * scale)
        lineTo(12.9893f * scale, 16.7686f * scale)
        cubicTo(12.9382f * scale, 17.2729f * scale, 12.5119f * scale, 17.6669f * scale, 11.9941f * scale, 17.667f * scale)
        cubicTo(11.4762f * scale, 17.667f * scale, 11.0501f * scale, 17.273f * scale, 10.999f * scale, 16.7686f * scale)
        lineTo(10.9941f * scale, 16.667f * scale)
        lineTo(10.9941f * scale, 12f * scale)
        cubicTo(10.9942f * scale, 11.4478f * scale, 11.4419f * scale, 11f * scale, 11.9941f * scale, 11f * scale)
        close()
        
        moveTo(12.1025f * scale, 6.57617f * scale)
        cubicTo(12.6065f * scale, 6.62751f * scale, 12.9998f * scale, 7.05381f * scale, 13f * scale, 7.57129f * scale)
        cubicTo(13f * scale, 8.08895f * scale, 12.6066f * scale, 8.51505f * scale, 12.1025f * scale, 8.56641f * scale)
        lineTo(12f * scale, 8.57129f * scale)
        lineTo(11.9883f * scale, 8.57129f * scale)
        cubicTo(11.436f * scale, 8.57127f * scale, 10.9883f * scale, 8.12356f * scale, 10.9883f * scale, 7.57129f * scale)
        cubicTo(10.9885f * scale, 7.0192f * scale, 11.4361f * scale, 6.57131f * scale, 11.9883f * scale, 6.57129f * scale)
        lineTo(12f * scale, 6.57129f * scale)
        lineTo(12.1025f * scale, 6.57617f * scale)
        close()
    }
    
    drawPath(
        path = infoIconPath,
        color = Color.Black.copy(alpha = 0.6f)
    )
}

/**
 * Preview composables for development and testing
 */
@Preview(showBackground = true)
@Composable
internal fun SonetelInfoButtonPreview() {
    Row(
        modifier = Modifier.padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Default size
        SonetelInfoButton(onClick = { })
        
        // Different sizes
        SonetelInfoButton(onClick = { }, size = 32.dp)
        SonetelInfoButton(onClick = { }, size = 56.dp)
        SonetelInfoButton(onClick = { }, size = 64.dp)
    }
}
