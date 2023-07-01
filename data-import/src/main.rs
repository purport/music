use std::{fs::File, io::BufReader};

use flate2::read::GzDecoder;
use xml::{reader::XmlEvent, EventReader};

fn main() {
    /*
    discogs_20230501_artists.xml.gz
    discogs_20230501_labels.xml.gz
    discogs_20230501_masters.xml.gz
    */
    let file = File::open("/home/purport/Code/music/data/discogs_20230501_masters.xml.gz")
        .expect("Unable to open file");
    let file = GzDecoder::new(file);
    let file = BufReader::new(file);

    let parser = EventReader::new(file);
    let mut iter = parser.into_iter();
    parse(&mut iter);
}

fn parse(iter: &mut xml::reader::Events<BufReader<GzDecoder<File>>>) {
    let mut master_count = 0;
    while let Some(e) = iter.next() {
        match e {
            Ok(XmlEvent::StartDocument { .. }) => (),
            Ok(XmlEvent::EndDocument { .. }) => break,
            Ok(XmlEvent::StartElement { name, .. }) if name.local_name == "masters" => {
                while let Some(e) = iter.next() {
                    match e {
                        Ok(XmlEvent::StartElement {
                            name,
                            attributes: _,
                            ..
                        }) if name.local_name == "master" => {
                            master_count += 1;
                            if master_count % 100000 == 0 {
                                println!("{master_count} masters")
                            };

                            while let Some(e) = iter.next() {
                                match e {
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "main_release" =>
                                    {
                                        let e = iter.next();
                                        if let Some(Ok(XmlEvent::Characters(_id))) = e {
                                            let e = iter.next();
                                            if let Some(Ok(XmlEvent::EndElement { .. })) = e {
                                            } else {
                                                unimplemented!("{:?}", e);
                                            }
                                        } else {
                                            unimplemented!("{:?}", e);
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "images" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "images" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "artists" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "artists" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "genres" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "genres" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "styles" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "styles" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "year" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "year" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "title" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "title" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "data_quality" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "data_quality" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "videos" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "videos" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::StartElement { name, .. })
                                        if name.local_name == "notes" =>
                                    {
                                        while let Some(e) = iter.next() {
                                            match e {
                                                Ok(XmlEvent::EndElement { name, .. })
                                                    if name.local_name == "notes" =>
                                                {
                                                    break;
                                                }
                                                Ok(_) => (),
                                                Err(e) => eprintln!("{:?}", e),
                                            }
                                        }
                                    }
                                    Ok(XmlEvent::EndElement { name, .. })
                                        if name.local_name == "master" =>
                                    {
                                        break;
                                    }
                                    Ok(e) => unimplemented!("{:?}", e),
                                    Err(e) => eprintln!("{:?}", e),
                                }
                            }
                        }
                        Ok(XmlEvent::EndElement { name, .. }) if name.local_name == "masters" => {
                            break;
                        }
                        Ok(XmlEvent::Whitespace { .. }) => (),
                        Ok(e) => unimplemented!("{:?}", e),
                        Err(e) => eprintln!("{e}"),
                    }
                }
            }
            Ok(XmlEvent::StartElement { name, .. }) => {
                unimplemented!("Start element {}", name.local_name)
            }
            Ok(XmlEvent::EndElement { name, .. }) => {
                unimplemented!("End element {}", name.local_name)
            }
            Ok(XmlEvent::ProcessingInstruction { .. }) => (),
            Ok(XmlEvent::CData { .. }) => (),
            Ok(XmlEvent::Comment { .. }) => (),
            Ok(XmlEvent::Whitespace { .. }) => (),
            Ok(e) => unimplemented!("{:?}", e),
            Err(e) => eprintln!("{e}"),
        }
    }
    println!("{master_count} masters");
}

#[derive(Debug, Default)]
struct Master {
    id: String,
    name: String,
}
