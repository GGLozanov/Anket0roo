package com.lozanov.anket0roo.ui

import com.gargoylesoftware.htmlunit.html.HtmlTextInput
import kotlinx.coroutines.delay
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterAll

import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.openqa.selenium.By
import org.openqa.selenium.WebElement

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SeleniumAuthenticationTest {
    lateinit var authPage: SeleniumAuthenticationPage

    @BeforeAll
    fun setUp() {
        authPage = SeleniumAuthenticationPage()
    }

    @AfterAll
    fun tearDown() {
        authPage.closeWindow()
    }

    @Test
    fun authenticate_withValidCredentials() {
        with(authPage.config.webDriver) {
            val username: WebElement = findElement(By.id("username"))
            val password: WebElement = findElement(By.id("password"))
            val formButton: WebElement = findElement(By.id("submit"))

            username.sendKeys("George Lozanov")
            password.sendKeys("popeye")
            formButton.click()
        }
        Thread.sleep(5000) // wait 5 seconds for request to complete
        Assertions.assertThat(authPage.config.webDriver.currentUrl).isEqualTo(authPage.clientUrl + "/profile")
    }
}