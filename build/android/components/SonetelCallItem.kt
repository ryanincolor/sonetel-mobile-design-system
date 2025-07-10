// Sonetel Call Item Component - Jetpack Compose
// Auto-generated on 7/10/2025 - Do not edit manually

package com.sonetel.designsystem.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.vectorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.sonetel.designsystem.SonetelDesignTokens
import com.sonetel.ui.theme.SonetelTypography

/**
 * Sonetel Call Item Component
 *
 * A list item component for displaying call history entries with proper design system styling.
 * Supports different states (default/pressed) and types (normal/missed call).
 *
 * @param contactName The name of the contact
 * @param timestamp The call timestamp/date
 * @param isMissedCall Whether this is a missed call (shows contact name in red)
 * @param onItemClick Called when the item is clicked
 * @param onInfoClick Called when the info button is clicked
 * @param modifier Modifier to be applied to the item
 */
@Composable
fun SonetelCallItem(
    contactName: String,
    timestamp: String,
    isMissedCall: Boolean = false,
    onItemClick: () -> Unit = {},
    onInfoClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(
                interactionSource = interactionSource,
                indication = null
            ) { onItemClick() }
            .padding(horizontal = SonetelDesignTokens.spacingL, vertical = SonetelDesignTokens.spacingS),
        horizontalArrangement = Arrangement.spacedBy(SonetelDesignTokens.spacingL),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Avatar
        SonetelAvatar(
            modifier = Modifier.size(44.dp)
        )
        
        // Labels section
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(SonetelDesignTokens.spacing2xs)
        ) {
            // Contact name
            Text(
                text = contactName,
                                style = SonetelTypography.Label.xlarge,
                                color = if (isMissedCall) SonetelDesignTokens.alertCriticalLight else SonetelDesignTokens.solidZ7Light
            )
            
                        // Timestamp
            Text(
                text = timestamp,
                                style = SonetelTypography.Label.large,
                                color = SonetelDesignTokens.solidZ5Light
            )
        }
        
        // Info button
        SonetelInfoButton(
            onClick = onInfoClick,
            modifier = Modifier.size(48.dp)
        )
    }
}



/**
 * Call item type variants
 */
enum class SonetelCallItemType {
    Default,
    Missed
}

/**
 * Call item state variants
 */
enum class SonetelCallItemState {
    Default,
    Pressed
}

/**
 * Preview composables for development and testing
 */
@Preview(showBackground = true)
@Composable
internal fun SonetelCallItemPreview() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Default call
        SonetelCallItem(
            contactName = "Contact",
            timestamp = "2025.03.01",
            isMissedCall = false,
            onItemClick = { },
            onInfoClick = { }
        )
        
        // Missed call
        SonetelCallItem(
            contactName = "Contact",
            timestamp = "2025.03.01",
            isMissedCall = true,
            onItemClick = { },
            onInfoClick = { }
        )
        
        // Long contact name
        SonetelCallItem(
            contactName = "Very Long Contact Name That Might Overflow",
            timestamp = "2025.03.01",
            isMissedCall = false,
            onItemClick = { },
            onInfoClick = { }
        )
    }
}
