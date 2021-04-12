package com.lozanov.anket0roo.ui

import com.gargoylesoftware.htmlunit.html.HtmlTextInput
import org.junit.jupiter.api.Test
import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.springframework.beans.factory.annotation.Value


class SeleniumAuthenticationPage {
    lateinit var config: SeleniumConfig
    val clientUrl: String = "http://localhost:8000"

    init {
        config = SeleniumConfig()
        config.webDriver.get(clientUrl + "/login")
    }

    fun closeWindow() {
        config.webDriver.close()
    }
}