using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Andromeda.Utilities
{
    public class ValidationUtilities
    {
        private static bool NotEmptyRule(string value)
        {
            return !string.IsNullOrWhiteSpace(value);
        }

        private static bool OnlyLettersNumbersAndUnderscorcesRule(string value)
        {
            return Regex.IsMatch(value, @"^[[a-zA-Z0-9а-яА-я]");
        }

        private static bool MoreThanValueLengthRule(string value, int minValue)
        {
            return value.Length >= minValue;
        }

        public static string ValidateRoleName(string name)
        {
            if (!NotEmptyRule(name))
                return "Role name should not be empty.";

            if (!OnlyLettersNumbersAndUnderscorcesRule(name))
                return "Role name must contains only letters, numbers and underscores.";

            return string.Empty;
        }
        
        public static string ValidateDepartmentFullName(string fullName)
        {
            if (!NotEmptyRule(fullName))
                return "Department full name should not be empty.";

            if (!OnlyLettersNumbersAndUnderscorcesRule(fullName))
                return "Department full name must contains only letters, numbers and underscores.";

            return string.Empty;
        }

        public static string ValidateUserName(string userName)
        {
            if (!NotEmptyRule(userName))
                return "User name should not be empty.";

            if (!OnlyLettersNumbersAndUnderscorcesRule(userName))
                return "User name must contains only letters, numbers and underscores.";

            if (!MoreThanValueLengthRule(userName, 5))
                return "User name is to short.";

            return string.Empty;
        }

        public static string ValidateEmail(string email)
        {
            if (!NotEmptyRule(email))
                return "Email should not be empty.";

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper, RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    var domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch
            {
                return "Email is not validated.";
            }

            try
            {
                if (!Regex.IsMatch(email,
                    @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                    @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250)))
                    return "Email is not validated.";
            }
            catch (RegexMatchTimeoutException)
            {
                return "Email is not validated.";
            }

            return string.Empty;
        }
    }
}