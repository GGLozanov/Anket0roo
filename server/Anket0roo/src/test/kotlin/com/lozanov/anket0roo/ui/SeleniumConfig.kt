package com.lozanov.anket0roo.ui

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.remote.DesiredCapabilities
import java.io.File
import java.util.concurrent.TimeUnit
import kotlin.properties.Delegates

class SeleniumConfig {
    lateinit var webDriver: WebDriver

    companion object {
        init {
            System.setProperty("webdriver.gecko.driver", findFile("geckodriver.exe"))
        }

        private fun findFile(filename: String): String {
            val paths = arrayOf("", "bin/", "target/classes/", "target/test-classes/")
            for (path in paths) {
                if (File(path + filename).exists()) return path + filename
            }
            return ""
        }
    }

    init {
        webDriver = ChromeDriver(ChromeOptions())
        webDriver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS)
    }
}