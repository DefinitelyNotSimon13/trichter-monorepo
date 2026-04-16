package org.trichter.app.ui.theme

import androidx.compose.ui.graphics.Color

// ─── Dark scheme
// Colors derived from web CSS variables (styles.css dark mode)
// oklch(0.13 0.015 250) = background, oklch(0.18 0.012 250) = card, etc.

val primaryDark = Color(0xFF46BD6E)           // oklch(0.78 0.22 138)
val onPrimaryDark = Color(0xFF0A2E18)         // oklch(0.18 0.06 135)
val primaryContainerDark = Color(0xFF0E3D20)
val onPrimaryContainerDark = Color(0xFFA8F0BE)

val secondaryDark = Color(0xFF8EA892)
val onSecondaryDark = Color(0xFF192B1D)
val secondaryContainerDark = Color(0xFF1E2B28)  // oklch(0.25 0.015 250) shifted greenish
val onSecondaryContainerDark = Color(0xFFCDE8D2)

val tertiaryDark = Color(0xFFCCAF42)           // oklch(0.78 0.16 75) — golden
val onTertiaryDark = Color(0xFF3A2A00)
val tertiaryContainerDark = Color(0xFF4E3B00)
val onTertiaryContainerDark = Color(0xFFF0D070)

val errorDark = Color(0xFFFFB4AB)
val onErrorDark = Color(0xFF690005)
val errorContainerDark = Color(0xFF93000A)
val onErrorContainerDark = Color(0xFFFFDAD6)

val backgroundDark = Color(0xFF0D0F14)         // oklch(0.13 0.015 250)
val onBackgroundDark = Color(0xFFF5F6F3)       // oklch(0.97 0.006 120)

val surfaceDark = Color(0xFF13151B)            // oklch(0.18 0.012 250)
val onSurfaceDark = Color(0xFFF5F6F3)
val surfaceVariantDark = Color(0xFF1C1E26)     // oklch(0.25 0.015 250)
val onSurfaceVariantDark = Color(0xFF9DA09A)   // oklch(0.65 0.012 130)

val outlineDark = Color(0x1AFFFFFF)            // white 10% — oklch(1 0 0 / 10%)
val outlineVariantDark = Color(0x0DFFFFFF)     // white 5%

val inverseSurfaceDark = Color(0xFFE3E4E0)
val inverseOnSurfaceDark = Color(0xFF2C2E35)
val inversePrimaryDark = Color(0xFF2D9150)

val scrimDark = Color(0xFF000000)

val surfaceDimDark = Color(0xFF0D0F14)
val surfaceBrightDark = Color(0xFF282A34)
val surfaceContainerLowestDark = Color(0xFF090B10)
val surfaceContainerLowDark = Color(0xFF151720)  // between background and card
val surfaceContainerDark = Color(0xFF191B22)     // oklch(0.22 0.012 250)
val surfaceContainerHighDark = Color(0xFF1D1F27) // slightly above muted
val surfaceContainerHighestDark = Color(0xFF21232C)

// ─── Light scheme
val primaryLight = Color(0xFF2A8C4A)            // oklch(0.72 0.22 138)
val onPrimaryLight = Color(0xFFFFFFFF)
val primaryContainerLight = Color(0xFFB0EEC4)
val onPrimaryContainerLight = Color(0xFF003918)

val secondaryLight = Color(0xFF476B4C)
val onSecondaryLight = Color(0xFFFFFFFF)
val secondaryContainerLight = Color(0xFFCBEDD2)
val onSecondaryContainerLight = Color(0xFF0B2010)

val tertiaryLight = Color(0xFF735800)           // oklch(0.82 0.16 75) dark for light bg
val onTertiaryLight = Color(0xFFFFFFFF)
val tertiaryContainerLight = Color(0xFFFFDC78)
val onTertiaryContainerLight = Color(0xFF261A00)

val errorLight = Color(0xFFBA1A1A)
val onErrorLight = Color(0xFFFFFFFF)
val errorContainerLight = Color(0xFFFFDAD6)
val onErrorContainerLight = Color(0xFF93000A)

val backgroundLight = Color(0xFFFAFAF7)         // oklch(0.99 0.008 95)
val onBackgroundLight = Color(0xFF161E18)        // oklch(0.14 0.012 135)

val surfaceLight = Color(0xFFFFFFFF)
val onSurfaceLight = Color(0xFF161E18)
val surfaceVariantLight = Color(0xFFDDE4DE)
val onSurfaceVariantLight = Color(0xFF404840)

val outlineLight = Color(0xFF6D756B)
val outlineVariantLight = Color(0xFFBCC9BC)

val inverseSurfaceLight = Color(0xFF2B302D)
val inverseOnSurfaceLight = Color(0xFFEFF6EF)
val inversePrimaryLight = Color(0xFF46BD6E)

val scrimLight = Color(0xFF000000)

val surfaceDimLight = Color(0xFFD4DBD5)
val surfaceBrightLight = Color(0xFFF4FBF4)
val surfaceContainerLowestLight = Color(0xFFFFFFFF)
val surfaceContainerLowLight = Color(0xFFEEF5EE)
val surfaceContainerLight = Color(0xFFE9EFE9)
val surfaceContainerHighLight = Color(0xFFE3E9E3)
val surfaceContainerHighestLight = Color(0xFFDDE3DD)
