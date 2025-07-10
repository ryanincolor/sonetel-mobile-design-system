// Sonetel Button Component - Jetpack Compose
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.designsystem.components

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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import com.sonetel.designsystem.SonetelDesignTokens
import com.sonetel.ui.theme.SonetelTypography

/**
 * Sonetel Button Component
 *
 * A Material 3 button that follows Sonetel design system specifications.
 * Supports multiple sizes, variants, and states with consistent styling.
 *
 * @param text The button label text
 * @param onClick Called when the button is clicked
 * @param modifier Modifier to be applied to the button
 * @param size The size variant of the button
 * @param variant The style variant of the button
 * @param isLoading Whether the button is in loading state
 * @param enabled Whether the button is enabled
 * @param interactionSource Optional interaction source for handling user interactions
 */
@Composable
fun SonetelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: SonetelButtonSize = SonetelButtonSize.Medium,
    variant: SonetelButtonVariant = SonetelButtonVariant.Primary,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() }
) {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !isLoading) 0.98f else 1f,
        label = "button_scale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .scale(scale)
            .height(size.height)
            .let { mod ->
                size.minWidth?.let { minWidth ->
                    mod.widthIn(min = minWidth)
                } ?: mod
            },
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = variant.backgroundColor,
            contentColor = variant.textColor,
            disabledContainerColor = variant.backgroundColor.copy(alpha = 0.5f),
            disabledContentColor = variant.textColor.copy(alpha = 0.5f)
        ),
        border = variant.borderColor?.let { BorderStroke(2.dp, it) },
        shape = RoundedCornerShape(size.height / 2),
        contentPadding = PaddingValues(
            horizontal = size.horizontalPadding,
            vertical = size.verticalPadding
        ),
        interactionSource = interactionSource
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
                style = size.textStyle
            )
        }
    }
}

/**
 * Button size variants with design token values
 */
enum class SonetelButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val verticalPadding: Dp,
    val textStyle: TextStyle,
    val minWidth: Dp?
) {
                        ExtraSmall(
        height = SonetelDesignTokens.spacing4xl,
        horizontalPadding = SonetelDesignTokens.spacingM,
        verticalPadding = SonetelDesignTokens.spacingXs,
        textStyle = SonetelTypography.labelSmall.copy(fontWeight = FontWeight.SemiBold),
        minWidth = null
    ),
    Small(
        height = SonetelDesignTokens.spacing10xl,
        horizontalPadding = SonetelDesignTokens.spacingL,
        verticalPadding = SonetelDesignTokens.spacingS,
        textStyle = SonetelTypography.labelMedium.copy(fontWeight = FontWeight.SemiBold),
        minWidth = null
    ),
    Medium(
        height = SonetelDesignTokens.spacing4xl + 4.dp,
        horizontalPadding = SonetelDesignTokens.spacingL,
        verticalPadding = SonetelDesignTokens.spacingS,
        textStyle = SonetelTypography.labelMedium.copy(fontWeight = FontWeight.SemiBold),
        minWidth = SonetelDesignTokens.spacing9xl
    ),
    Large(
        height = SonetelDesignTokens.spacing6xl,
        horizontalPadding = SonetelDesignTokens.spacingXl,
        verticalPadding = SonetelDesignTokens.spacingL,
        textStyle = SonetelTypography.labelLarge.copy(fontWeight = FontWeight.SemiBold),
        minWidth = SonetelDesignTokens.spacing10xl
    ),
    ExtraLarge(
        height = SonetelDesignTokens.spacing7xl,
        horizontalPadding = SonetelDesignTokens.spacingXl,
        verticalPadding = SonetelDesignTokens.spacingL,
        textStyle = SonetelTypography.labelLarge.copy(
            fontWeight = FontWeight.SemiBold,
            letterSpacing = SonetelDesignTokens.letterSpacingTight
        ),
        minWidth = 280.dp
    )
}

/**
 * Button style variants using design tokens
 */
enum class SonetelButtonVariant(
    val backgroundColor: Color,
    val textColor: Color,
    val borderColor: Color?
) {
    Primary(SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ0Light, null),
    Secondary(SonetelDesignTokens.solidZ1Light, SonetelDesignTokens.solidZ7Light, null),
    Outline(Color.Transparent, SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ7Light),
    Ghost(Color.Transparent, SonetelDesignTokens.solidZ7Light, null),
    Destructive(SonetelDesignTokens.alertCriticalLight, SonetelDesignTokens.solidZ0Light, null),
    Success(SonetelDesignTokens.accentsGreenLight, SonetelDesignTokens.solidZ0Light, null)
}

/**
 * Preview composables for development and testing
 */
@Preview(showBackground = true)
@Composable
internal fun SonetelButtonPreview() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
                // Size variants
        SonetelButtonSize.entries.forEach { size ->
            SonetelButton(
                text = size.name,
                onClick = { },
                size = size
            )
        }

        // Style variants
        SonetelButtonVariant.entries.forEach { variant ->
            SonetelButton(
                text = variant.name,
                onClick = { },
                variant = variant
            )
        }
    }
}
