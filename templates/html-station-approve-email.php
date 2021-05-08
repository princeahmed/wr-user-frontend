<div class="email-wrap">

    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff">
        <tbody>

        <!-- Header -->
        <tr>
            <td height="25" style="background:#222;padding:15px 5%;font-size:1px;border-collapse:collapse;margin:0">
                <p style="margin-top:0;margin-bottom:0">
                    <span style="color:#fff;font-size:20px;font-family:inherit;font-weight:bold;text-transform:uppercase;text-decoration:initial;line-height:40px;letter-spacing:normal">Station Submission Approved:</span>
                </p></td>
        </tr>

        <!--Header bottom border-->
        <tr>
            <td height="25" style="background:#29abe1;padding:0;font-size:1px;border-collapse:collapse;margin:0;height:5px"></td>
        </tr>

        <tr>
            <td valign="top" style="color:#595959;font-size:15px;font-family:HelveticaNeue,Roboto,sans-serif;font-weight:initial;text-transform:initial;text-decoration:initial;line-height:22px;letter-spacing:normal;padding:5%;margin-bottom:1rem;background:#fff">
                <div>

                    <p dir="ltr" style="margin-top:0;margin-bottom:0;margin-left:0;margin-right:0">Hello <?php echo $user_name; ?>,</p><br>
                    <p dir="ltr" style="margin-top:0;margin-bottom:0;margin-left:0;margin-right:0">Your radio station submission has been approved:</p>

                    <h3 style="color:#666;font-size:24px;font-family:inherit;font-weight:bold;text-transform:none;text-decoration:initial;line-height:31px;letter-spacing:normal">Station Details:</h3>

                    <table cellpadding="0" cellspacing="0" style="width:100%;font-family:HelveticaNeue,Roboto,sans-serif;font-size:15px">
                        <tbody>
						<?php
						foreach ( $args as $label => $value ) {
							printf( '<tr>
                            <td style="text-align:right;width:120px;padding:8px;background:#eee;border:1px solid #eee;border-width:1px 0">
                                <u></u><b> %1$s:</b><u></u></td>
                            <td style="padding:8px;background:#fff;border:1px solid #eee">%2$s</td>
                        </tr>', $label, $value );
						}
						?>

                        </tbody>
                    </table>


                </div>
            </td>
        </tr>


        <tr>
            <td align="center" height="35" style="border-collapse:collapse">
                <a rel="noopener" href="<?php echo get_the_permalink($post_id); ?>" style="background:#cc4d29;border-radius:3px;color:#fff!important;font-size:11px;font-weight:600;padding:11px 10px;text-align:center;text-decoration:none;text-transform:uppercase;white-space:nowrap" target="_blank">View Station</a>
            </td>
        </tr>

        </tbody>
    </table>

</div>